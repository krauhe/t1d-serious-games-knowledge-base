"""Retry explicitly discovered institutional/author full texts and verify a product page locally."""
import hashlib
import json
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urljoin
import requests
import pymupdf
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[3]
WORK = ROOT/'.validation/review-2026-09-06/supplement'
WORK.mkdir(parents=True, exist_ok=True)
TARGETS = [
 ('I Got This official provenance', 'https://lawrencehallofscience.org/science-apps/i-got-this/', None),
 ('Brown 1997', 'https://www.researchgate.net/publication/259559255_Educational_Video_Game_for_Juvenile_Diabetes_Results_of_a_Controlled_Trial', None),
 ('Wouters 2013', 'https://www.researchgate.net/profile/C-Nimwegen-2/publication/263936571_A_Meta-Analysis_of_the_Cognitive_and_Motivational_Effects_of_Serious_Games/links/5ece14544585152945148fe6/A-Meta-Analysis-of-the-Cognitive-and-Motivational-Effects-of-Serious-Games.pdf', 'Wouters_2013_RW_CognitiveMotivationalEffects.pdf'),
 ('Butler 2010', 'https://people.duke.edu/~ab259/pubs/Butler(2010).pdf', 'Butler_2010_RetrievalTransfer.pdf'),
 ('Butler author publications', 'https://sites.wustl.edu/mdl1/publications/', None),
 ('Cobelli 2009', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2951686/', 'Cobelli_2009_RW_ModelsSignalsControl.html'),
 ('Butler 2010 current author deposit', 'https://sites.wustl.edu/mdl1/files/2026/06/Butler-2010-Repeated-testing-produces-superior-transfer-of-learning-relative-to-repeated-studying.pdf', 'Butler_2010_RetrievalTransfer.pdf'),
 ('Butler et al. 2013 explanatory feedback', 'https://sites.wustl.edu/mdl1/files/2026/06/Butler-et-al.-2013-Explanation-feedback-is-better-than-correct-answer-feedback-for-promoting-transfer-of-learning.pdf', 'Butler_2013_ExplanationFeedbackTransfer.pdf')
]
rows=[]
for label,url,filename in TARGETS:
    row={'label':label,'url':url,'checked_at':datetime.now(timezone.utc).isoformat()}
    try:
        response=requests.get(url, timeout=25, headers={'User-Agent':'T1D-Knowledge-Base-Evidence-Audit/1.0'})
        row.update(status=response.status_code,final_url=response.url,bytes=len(response.content))
        soup=BeautifulSoup(response.content,'html.parser') if not response.content.startswith(b'%PDF') else None
        text=soup.get_text(' ',strip=True) if soup else ''
        key=hashlib.sha256(url.encode()).hexdigest()[:16]
        (WORK/(key+'.txt')).write_text(text,encoding='utf-8')
        row['title']=soup.title.get_text(' ',strip=True) if soup and soup.title else None
        valid=False
        if response.ok and filename and response.content.startswith(b'%PDF'):
            with pymupdf.open(stream=response.content,filetype='pdf') as doc:
                row['first_page']=doc[0].get_text()[:1400]
                valid=len(doc)>2
        elif response.ok and filename and soup:
            valid=bool(soup.find('meta',attrs={'name':'citation_title'}) and len(soup.select('section'))>5 and len(text)>20000)
        if valid:
            path=ROOT/'private-literature/articles'/filename
            if not path.exists(): path.write_bytes(response.content)
            row['file']=path.relative_to(ROOT).as_posix()
            row['sha256']=hashlib.sha256(path.read_bytes()).hexdigest()
        if soup and 'wustl' in url:
            row['links']=[{'text':a.get_text(' ',strip=True),'url':urljoin(response.url,a.get('href',''))} for a in soup.select('a[href]') if any(x in a.get('href','').lower() for x in ['2010','2006','butler'])]
        if soup and 'lawrencehall' in url:
            i=text.find('Step into')
            row['product_excerpt']=text[i:i+1600]
    except requests.RequestException as e: row['error']=str(e)
    rows.append(row)
    print(json.dumps(row,ensure_ascii=False),flush=True)
(WORK/'results.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
