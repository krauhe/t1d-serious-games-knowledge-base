"""Produce the manual appraisal ledger and machine-readable finding register.

These explicit judgments are not inferred from file presence or a successful
request. Re-run after prepare.py to reconcile retained files and source hashes.
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
REPORT = OUT.with_suffix('.md')

# Each entry states the actual reading depth, not an automatic quality score.
APPRAISALS = [
    ('10.1177/19322968231223759', 'Full-text methods, outcomes, allocation changes, tables and disclosures', 'F03, F18', 'Randomised commercial trial with a glycaemic endpoint; post-randomisation exclusions and allocation changes limit interpretation.'),
    ('10.1145/2207676.2207687', 'Title, abstract and study scope', 'F12', 'Non-diabetes tutorial experiments; not evidence for a universal five-to-eight-participant rule.'),
    ('10.1089/g4h.2015.0038', 'Author manuscript, abstract, Methods 4.1-4.3, results and limitations', 'F02', 'Uncontrolled Android pilot; 12 children aged 9-13; diabetes not required for eligibility.'),
    ('10.2196/79338', 'Abstract and review scope; full-text XML retained, complete critical appraisal outstanding', 'F19', 'Broader paediatric digital-health comparator, not exclusively serious games.'),
    ('10.1136/bmjopen-2019-036453', 'Abstract, objectives and eligibility scope', 'F07', 'Adjacent healthcare sustainability evidence; cannot establish causes of T1D game discontinuation.'),
    ('10.3109/14639239709089835', 'Abstract and bibliographic metadata only', 'Executive assessment; section 4', '59 participants, six-month study; selected behavioural signals. Full text still required for deeper appraisal.'),
    ('10.1037/a0019902', 'Title, abstract and selected experimental/discussion sections of author-deposited PDF', 'Section 4', 'Text-learning retrieval/transfer experiments; no T1D or simulation efficacy inference.'),
    ('10.1037/a0031026', 'Title, abstract, Methods and Results of experiments 1 and 2, and sample feedback', 'F11', '60 and 24 university students analysed; delayed inference questions favour explanation feedback in these experimental conditions.'),
    ('10.1109/rbme.2009.2036073', 'Metadata and abstract; no acquired full text', 'F01', 'Correct intended review identity; model claims require subsequent full-text verification.'),
    ('10.5812/ijp.25(3)2015.427', 'Full-text title, abstract and endpoint description', 'F17', 'Observed injection distress is not independently assessed injection technique.'),
    ('10.1038/s41598-025-30114-1', 'Title, abstract and targeted methods/results passages', 'F15, F17', '2026 volume, online 2025. Abstract session-completion wording differs from body participant-attendance denominator; preserve discrepancy.'),
    ('10.1007/s40262-014-0165-y', 'Full-text identity and targeted pharmacology passages', 'F01, F16', 'Correct Haahr/Heise degludec review; quantitative values require study/formulation context.'),
    ('10.3389/fdgth.2022.1014375', 'Abstract, objectives and eligibility scope', 'F07', 'Low-/middle-income-country digital-health sustainability review; adjacent rather than direct T1D game evidence.'),
    ('https://lawrencehallofscience.org/science-apps/i-got-this/', 'Official product page visible text fetched from local computer', 'F04', 'T2D protagonist and Lawrence Hall of Science provenance; no installation or store/device test.'),
    ('10.1109/comapp.2018.8460213', 'Publication metadata; primary full text not acquired; anchor review description checked separately', 'F10', 'Bibliographic title is wrong in the KB; paired caregiver architecture remains unverified, not disproven.'),
    ('10.1590/1980-220x-reeusp-2024-0134en', 'Abstract and review scope; full-text XML retained, complete critical appraisal outstanding', 'F19', '53-study broad family/child educational-technology comparator; not an exclusively digital-game review.'),
    ('10.1177/19322968211018236', 'Review methods, scope and relevant game-description tables', 'F02, F10', 'Secondary extraction checked against primary reports; not treated as error-free.'),
    ('10.1016/j.diabres.2024.111833', 'Full-text eligibility, tables, availability results, discussion and conclusion', 'F04-F06', 'Mixed T1D/T2D review; limited/non-public release is not a measured longitudinal disappearance rate.'),
    ('10.1152/ajpendo.1981.240.6.e630', 'Correct identity and abstract; full text outstanding', 'F01', 'Correct dose-response study identity; no full re-extraction of quantitative physiology claimed.'),
    ('10.3102/0034654307313795', 'Title, abstract and review scope', 'F11', 'Feedback effectiveness is conditional; no proof of a universal T1D simulation feedback architecture.'),
    ('10.1016/j.pedhc.2024.05.009', 'Abstract and bibliographic metadata only', 'F17', 'Feasibility/resilience study; full-text appraisal remains blocked by retrieval gap.'),
    ('10.2196/43574', 'Full-text eligibility, quantitative results and limitations', 'Executive assessment; F05, F18; section 4', 'Mixed-diabetes HbA1c estimate and activity heterogeneity checked; not T1D educational-transfer evidence.'),
]

def main():
    access = json.loads((OUT/'source-access-register.json').read_text(encoding='utf-8'))
    supplement = json.loads((ROOT/'.validation/review-2026-09-06/supplement/results.json').read_text(encoding='utf-8'))
    ledger = []
    for identifier, depth, findings, interpretation in APPRAISALS:
        matches = [r for r in access if r['id'].lower() == identifier.lower()]
        files = {f['path']:f for r in matches for f in r['fulltext_files']}
        item = {'identifier':identifier, 'findings':findings, 'inspection_depth':depth,
                'assessment':interpretation, 'checked_on':'2026-09-06',
                'identity_verified_for_this_use':True,
                'fulltext_files':list(files.values()),
                'access_status':'full text retained' if files else 'full text not acquired; wishlist',
                'metadata_urls':[r['url'] for r in matches]}
        for f in item['fulltext_files']:
            f['identity_status'] = 'manually checked; appraisal depth explicitly limited'
        if identifier.startswith('https://lawrencehall'):
            result = next(s for s in supplement if s['url'] == identifier)
            item.update(access_status='official page read; not a scholarly full-text request',
                        local_response={k:result.get(k) for k in ['url','status','final_url','checked_at']})
        elif not matches:
            raise ValueError('Appraised source absent from acquisition register: '+identifier)
        ledger.append(item)
    (OUT/'inspected-sources.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding='utf-8')
    text = REPORT.read_text(encoding='utf-8')
    findings = []
    for m in re.finditer(r'^### (F\d+) — (Major|Minor|Editorial): (.+)$', text, re.M):
        findings.append({'id':m[1], 'severity':m[2].lower(), 'title':m[3], 'status':'partially addressed' if m[1]=='F21' else 'open',
                         'report_line':text[:m.start()].count('\n')+1})
    assert len(findings) == 24
    result={'review_date':'2026-09-06','report_sha256':hashlib.sha256(REPORT.read_bytes()).hexdigest(),
            'findings':findings,'note':'Finding statuses refer to reviewed scientific content, not the newly delivered audit tooling.'}
    (OUT/'findings.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'appraised_source_records':len(ledger),'with_retained_fulltext':sum(bool(x['fulltext_files']) for x in ledger),
                      'findings':len(findings),'fulltext_outstanding':[x['identifier'] for x in ledger if 'wishlist' in x['access_status']]},indent=2))

if __name__ == '__main__':
    main()
