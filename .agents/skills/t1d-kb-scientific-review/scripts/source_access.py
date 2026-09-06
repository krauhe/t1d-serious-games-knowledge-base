"""Collect source metadata and lawful full-text candidates for human review.

Technical retrieval never establishes that a cited claim is supported. This tool
keeps page bodies privately, records every attempt, and downloads only publisher
PDF candidates or repository full-text XML. Existing files are never overwritten.
Requires requests, BeautifulSoup and PyMuPDF. Uses explicit repository paths.
"""
from __future__ import annotations
import argparse
import concurrent.futures
import hashlib
import json
import re
import threading
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote, urljoin, urlparse
import requests
from bs4 import BeautifulSoup
import pymupdf

LOCK = threading.Lock()
HEADERS = {'User-Agent': 'T1D-Knowledge-Base-Evidence-Audit/1.0 (local scholarly source verification)'}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--inventory', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--extra-local', type=Path)
    args = parser.parse_args()
    root, out = args.root.resolve(), args.output.resolve()
    out.mkdir(parents=True, exist_ok=True)
    (out / 'responses').mkdir(exist_ok=True)
    dest = root / 'private-literature/articles'
    dest.mkdir(parents=True, exist_ok=True)
    inv = json.loads(args.inventory.read_text(encoding='utf-8'))
    entries = [e for e in inv['urls'] if any(x in e['url'] for x in ['doi.org/', 'pubmed.ncbi.nlm.nih.gov/', 'pmc.ncbi.nlm.nih.gov/', 'arxiv.org/abs/', 'hdl.handle.net/'])]
    existing = {}
    candidates = list(dest.glob('*'))
    if args.extra_local:
        candidates += list(args.extra_local.glob('*'))
    for path in candidates:
        if not path.is_file() or path.suffix.lower() not in ('.pdf', '.html', '.xml'):
            continue
        try:
            if path.suffix.lower() == '.pdf':
                with pymupdf.open(path) as doc:
                    text = ''.join(doc[p].get_text() for p in range(min(2, len(doc))))
                doi = re.search(r'10\.\d{4,9}/[-._;()/:A-Z0-9]+', text, re.I)
                if doi:
                    existing.setdefault(doi.group().rstrip('.,;)').lower(), []).append(str(path))
            else:
                soup = BeautifulSoup(path.read_text(encoding='utf-8', errors='replace'), 'html.parser')
                meta = soup.find('meta', attrs={'name': 'citation_doi'}) or soup.find('article-id', attrs={'pub-id-type': 'doi'})
                doi = (meta.get('content') or meta.get_text()).strip().lower() if meta else None
                # Reject hand-written summaries and abstract-only pages as full text.
                substantial = len(soup.select('section, sec')) >= 3 or bool(soup.find('body') and soup.find('article-title'))
                if doi and substantial:
                    existing.setdefault(doi, []).append(str(path))
        except Exception:
            continue

    def inspect(entry):
        row = dict(entry)
        row.update({'checked_at': datetime.now(timezone.utc).isoformat(), 'attempts': [], 'fulltext_candidates': [], 'claim_support': 'requires human appraisal'})
        key = hashlib.sha256(entry['url'].encode()).hexdigest()[:16]
        session = requests.Session()
        session.headers.update(HEADERS)
        def get(url, kind):
            attempt = {'url': url, 'kind': kind, 'attempted_at': datetime.now(timezone.utc).isoformat()}
            try:
                resp = session.get(url, timeout=(10, 25))
                attempt.update({'status': resp.status_code, 'final_url': resp.url, 'bytes': len(resp.content)})
                row['attempts'].append(attempt)
                if resp.ok:
                    return resp
            except requests.RequestException as exc:
                attempt['error'] = str(exc)
                row['attempts'].append(attempt)
            return None
        try:
            page = get(entry['url'], 'cited destination')
            doi, pmid, pmcid = None, None, None
            if 'doi.org/' in entry['url']:
                doi = entry['url'].split('doi.org/', 1)[1]
            match = re.search(r'pubmed\.ncbi\.nlm\.nih\.gov/(\d+)', entry['url'])
            if match:
                pmid = match.group(1)
            match = re.search(r'/articles/(PMC\d+)', entry['url'])
            if match:
                pmcid = match.group(1)
            pdf_url = None
            if page is not None:
                soup = BeautifulSoup(page.content, 'html.parser')
                meta = {}
                for m in soup.find_all('meta'):
                    n = m.get('name', m.get('property', ''))
                    if n.startswith(('citation_', 'DC.', 'dc.')):
                        meta.setdefault(n, []).append(m.get('content', ''))
                row['destination_metadata'] = meta
                row['destination_title'] = soup.title.get_text(' ', strip=True) if soup.title else ''
                doi = doi or next(iter(meta.get('citation_doi', [])), None)
                pdf_url = next(iter(meta.get('citation_pdf_url', [])), None)
                clean = BeautifulSoup(page.content, 'html.parser')
                for m in clean(['script', 'style', 'nav', 'footer']):
                    m.decompose()
                (out / 'responses' / f'{key}.md').write_text(clean.get_text(' ', strip=True), encoding='utf-8')
                row['private_response_text'] = f'responses/{key}.md'
            if doi:
                cr = get('https://api.crossref.org/works/' + quote(doi, safe=''), 'Crossref metadata')
                if cr is not None:
                    msg = cr.json().get('message', {})
                    row['crossref'] = {k: msg.get(k) for k in ['DOI', 'title', 'author', 'published', 'container-title', 'type', 'is-referenced-by-count', 'link']}
            query = ('EXT_ID:' + pmid + ' AND SRC:MED') if pmid else ('DOI:"' + doi + '"') if doi else ('PMCID:' + pmcid) if pmcid else None
            ep = get('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' + quote(query) + '&format=json&resultType=core', 'Europe PMC metadata') if query else None
            paper = None
            if ep is not None:
                found = ep.json().get('resultList', {}).get('result', [])
                if found:
                    paper = found[0]
                    row['europe_pmc'] = {k: paper.get(k) for k in ['id','source','pmcid','doi','title','authorString','pubYear','isOpenAccess','abstractText','fullTextUrlList']}
                    doi = doi or paper.get('doi')
                    pmcid = pmcid or paper.get('pmcid')
            row['doi'] = doi
            row['pmid'] = pmid or (paper.get('id') if paper and paper.get('source') == 'MED' else None)
            row['pmcid'] = pmcid
            local = existing.get((doi or '').lower().rstrip('.,;)'), [])
            if local:
                for candidate in local:
                    path = Path(candidate)
                    target = dest / path.name
                    if path.parent != dest and not target.exists():
                        target.write_bytes(path.read_bytes())
                    if target.exists():
                        row['fulltext_candidates'].append({'path': target.relative_to(root).as_posix(), 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'route': 'existing local scholarly collection', 'requires_identity_and_body_check': True})
            else:
                crmeta = row.get('crossref', {})
                title = (paper or {}).get('title') or next(iter(crmeta.get('title') or []), '') or row.get('destination_title', '')
                authors = crmeta.get('author') or []
                author = authors[0].get('family', 'Source') if authors else ((paper or {}).get('authorString') or 'Source').split()[0]
                year = str((paper or {}).get('pubYear') or ((crmeta.get('published') or {}).get('date-parts') or [['nd']])[0][0])
                stem = unicodedata.normalize('NFKD', f'{author} {year} - {title[:90]}').encode('ascii', 'ignore').decode()
                stem = re.sub(r'[<>:"/\\|?*]', '', stem).strip(' .')[:120] or 'Source'
                # Different records can have identical or missing bibliographic
                # metadata. A URL-derived suffix prevents silent file collisions.
                stem = stem + ' - ' + key
                if pmcid:
                    xml = get('https://www.ebi.ac.uk/europepmc/webservices/rest/' + pmcid + '/fullTextXML', 'repository full text XML')
                    if xml is not None and b'<body' in xml.content and b'<article' in xml.content:
                        target = dest / f'{stem}.xml'
                        if not target.exists():
                            target.write_bytes(xml.content)
                        row['fulltext_candidates'].append({'path': target.relative_to(root).as_posix(), 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'route': xml.url, 'requires_identity_and_body_check': True})
                if not row['fulltext_candidates']:
                    pdf_urls = [pdf_url] if pdf_url else []
                    for link in crmeta.get('link') or []:
                        if link.get('content-type') == 'application/pdf':
                            pdf_urls.append(link.get('URL'))
                    for purl in list(dict.fromkeys(pdf_urls))[:2]:
                        if not purl:
                            continue
                        pdf = get(urljoin(entry['url'], purl), 'publisher PDF')
                        if pdf is None or not pdf.content.startswith(b'%PDF'):
                            continue
                        try:
                            with pymupdf.open(stream=pdf.content, filetype='pdf') as doc:
                                text = ''.join(p.get_text() for p in doc)
                                valid = len(doc) > 1 and len(text) > 1800
                            if valid:
                                target = dest / f'{stem}.pdf'
                                if not target.exists():
                                    target.write_bytes(pdf.content)
                                row['fulltext_candidates'].append({'path': target.relative_to(root).as_posix(), 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'route': pdf.url, 'requires_identity_and_body_check': True})
                                break
                        except Exception:
                            pass
            row['access_status'] = 'full-text candidate retained; human validation pending' if row['fulltext_candidates'] else 'full text not acquired'
        except Exception as exc:
            row['error'] = str(exc)
        with LOCK:
            (out / f'{key}.json').write_text(json.dumps(row, ensure_ascii=False, indent=2), encoding='utf-8')
            print(f'{entry["url"]} | {row.get("access_status", "metadata error")}', flush=True)
        return row
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(inspect, entries))
    (out / 'source-access.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'source_urls': len(results), 'with_fulltext_candidates': sum(bool(r['fulltext_candidates']) for r in results)}, indent=2))


if __name__ == '__main__':
    main()
