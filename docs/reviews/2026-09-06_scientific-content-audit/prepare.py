"""Prepare reproducible audit evidence without changing reviewed chapters.

Private article text stays under .validation; public records contain metadata,
source locations, file hashes and explicit verification limitations only.
"""
import argparse
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from bs4 import BeautifulSoup
import pymupdf

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
WORK = ROOT / '.validation/review-2026-09-06'

# These existing files were opened and identified directly during the audit.
MANUAL_FILES = {
    '10.1089/g4h.2015.0038': 'Baghaei 2016 - Diabetic Mario.pdf',
    '10.1145/2207676.2207687': 'Andersen_2012_ImpactTutorials.pdf',
    '10.1037/a0019902': 'Butler_2010_RetrievalTransfer.pdf',
}
MISMATCH_PMIDS = ['7026740','32591907','7011057','12107742','19150402','30058925','24729196','15303622','20948577','29994703','21129332','18175767']

def dump(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding='utf-8')

def article(path):
    if path.suffix == '.pdf':
        with pymupdf.open(path) as doc:
            text = '\n'.join(p.get_text() for p in doc)
            return {'text': text, 'pages': len(doc), 'body_present': len(text) > 3000 and len(doc) > 1}
    soup = BeautifulSoup(path.read_text(encoding='utf-8', errors='replace'), 'html.parser')
    for el in soup(['script', 'style', 'nav']):
        el.decompose()
    title = soup.find('article-title') or soup.find('meta', attrs={'name': 'citation_title'}) or soup.title
    title = (title.get('content') or title.get_text(' ', strip=True)) if title else ''
    body = soup.find('body')
    text = soup.get_text(' ', strip=True)
    return {'text': text, 'title': title, 'body_present': bool(body and len(text) > 3000 and (len(soup.select('sec,section')) > 2 or soup.find('article-title')))}

def main():
    inv = json.loads((WORK / 'inventory.json').read_text(encoding='utf-8'))
    rows = {}
    for name in ['source-access', 'additional-access']:
        for r in json.loads((WORK / name / 'source-access.json').read_text(encoding='utf-8')):
            if r['url'] in rows:
                r['locations'] = rows[r['url']]['locations']
            rows[r['url']] = r
    supplements = json.loads((WORK / 'supplement/results.json').read_text(encoding='utf-8'))
    for s in supplements:
        if not s.get('file'):
            continue
        is_2013 = '2013' in s['file']
        doi = '10.1037/a0031026' if is_2013 else '10.1037/a0019902'
        title = ('Explanation Feedback Is Better Than Correct Answer Feedback for Promoting Transfer of Learning'
                 if is_2013 else 'Repeated Testing Produces Superior Transfer of Learning Relative to Repeated Studying')
        rows[s['url']] = {
            'url': s['url'], 'doi': doi,
            'crossref': {'title':[title], 'author':[{'family':'Butler'}], 'published':{'date-parts':[[2013 if is_2013 else 2010]]}},
            'locations':[{'path':'docs/reviews/2026-09-06_scientific-content-audit.md', 'label':s['label']}],
            'fulltext_candidates':[{'path':s['file'], 'route':s['url']}],
            'attempts':[{k:v for k,v in s.items() if k not in ['first_page','links']}],
        }
    local = {}
    for path in sorted((ROOT / 'private-literature/articles').glob('*')):
        if path.suffix.lower() not in ['.pdf','.html','.xml']:
            continue
        try:
            a = article(path)
            a['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
            local[path.relative_to(ROOT).as_posix()] = a
            (WORK / 'article-text' / (path.stem+'.md')).write_text(a['text'], encoding='utf-8')
        except Exception as exc:
            local[path.relative_to(ROOT).as_posix()] = {'error': str(exc), 'body_present': False, 'text': ''}
    inspection, sources = [], []
    for r in rows.values():
        ep, cr = r.get('europe_pmc') or {}, r.get('crossref') or {}
        doi = (r.get('doi') or '').lower()
        title = ep.get('title') or ' / '.join(cr.get('title') or []) or r.get('destination_title','')
        pmid = r.get('pmid')
        candidates = list(r.get('fulltext_candidates', []))
        if doi in MANUAL_FILES:
            p = 'private-literature/articles/' + MANUAL_FILES[doi]
            if not any(c['path'] == p for c in candidates):
                candidates.append({'path':p, 'route':'Existing file identified by direct reading'})
        # A URL may point to the wrong paper. Such downloads do not satisfy
        # acquisition of the publication named in the knowledge base.
        mismatch = pmid in MISMATCH_PMIDS
        retained = []
        for c in candidates:
            a = local.get(c['path'], {})
            if not a.get('body_present'):
                continue
            # Original filename collision in the first retrieval run: never
            # count this ambiguous candidate. Correct records were reacquired.
            if c['path'].endswith('/Source nd -.xml'):
                continue
            retained.append({'path':c['path'],'sha256':a['sha256'],'retrieval_route':c['route'], 'identity_status':'candidate; see inspected-source ledger'})
            inspection.append(f"\n## {r['url']}\nExpected: {title}\nFile: {c['path']}\n{a['text'][:650]}\n")
        status = 'bibliographic mismatch; resolve intended source' if mismatch else 'full-text file retained; appraisal coverage varies' if retained else 'full text not acquired'
        sources.append({'id':doi or ('PMID:'+pmid if pmid else r['url']), 'url':r['url'], 'title_at_destination':title, 'authors':ep.get('authorString') or '; '.join((x.get('family','') for x in cr.get('author') or [])), 'year':ep.get('pubYear') or ((cr.get('published') or {}).get('date-parts') or [[None]])[0][0], 'pmid':pmid, 'pmcid':r.get('pmcid'), 'locations':r['locations'], 'status':status, 'fulltext_files':[] if mismatch else retained, 'checked_on':'2026-09-06', 'attempts':r.get('attempts',[]), 'claim_support':'Not inferred from retrieval; consult report and inspected-source ledger'})
    dump(OUT / 'source-access-register.json', sources)
    (WORK/'candidate-inspection.md').write_text(''.join(inspection), encoding='utf-8')
    coverage = {'review_date':'2026-09-06', 'scope':'Complete source-corpus inspection, not complete independent verification of all underlying evidence', 'documents':[dict(s,review_status='inspected; findings and unresolved source checks in report') for s in inv['sources']], 'game_records':[{'id':g['id'],'title':g['title'],'status':'record inspected; not playtested; no installation test'} for g in inv['games']]}
    dump(OUT/'coverage.json', coverage)
    grouped = {}
    for s in sources:
        group = grouped.setdefault(s['id'], [])
        group.append(s)
    pending = [g for g in grouped.values() if not any(x['fulltext_files'] for x in g)]
    lines = ['# Supplementary full-text acquisition backlog', '', 'Checked 6 September 2026. This register covers the linked scholarly sources encountered in the audit, including physiological and learning-science references. It is not limited to paywalls: repository failures and unresolved bibliographic identities are separate states. Candidate downloads are not proof that claims are supported.', '', '| Source or intended citation | Identifier | Status and next route |', '|---|---|---|']
    for group in pending:
        s = group[0]
        label = s['title_at_destination'] or str(s['id'])
        if 'mismatch' in s['status']:
            label = 'Intended: '+s['locations'][0].get('label', '')+'; linked record has a different identity'
        route = 'Resolve the intended work before requesting full text.' if 'mismatch' in s['status'] else 'Publisher/repository attempts unsuccessful; institutional library, interlibrary loan, or lawful author manuscript.'
        lines.append('| '+label.replace('|','/')+' | ['+s['id'].replace('|','/')+']('+s['url']+') | '+s['status']+'. '+route+' |')
    (OUT/'full-text-backlog.md').write_text('\n'.join(lines)+'\n', encoding='utf-8')
    counts = {'documents':len(inv['sources']), 'games':len(inv['games']), 'scholarly_urls_checked':len(sources), 'canonical_identifiers':len(grouped), 'identifiers_with_retained_fulltext':sum(any(x['fulltext_files'] for x in g) for g in grouped.values()), 'identifiers_without_retained_fulltext_or_identity_unresolved':len(pending), 'misidentified_citations':len(MISMATCH_PMIDS), 'article_files_total':len(local), 'original_article_files':len(inv['articles']), 'note':'Retained files include candidate matches, different formats and unrelated records reached through erroneous citations. Counts are not numbers of fully appraised studies.'}
    dump(OUT/'counts.json',counts)
    print(json.dumps(counts,indent=2))

if __name__ == '__main__':
    main()
