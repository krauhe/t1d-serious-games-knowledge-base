"""Kontroller reelle test-PDF'er og lav kontaktark til visuel sidekontrol.

Køres efter check-print-browser.mjs. QA-filer forbliver i .validation/pdf/.
Tekstudtræk supplerer, men erstatter ikke visuel kontrol af kontaktarkene.
"""
from pathlib import Path
import html
import json
import re
import unicodedata
from pypdf import PdfReader
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
folder = root / '.validation' / 'pdf'
source = (root / '_site' / 'reading.html').read_text(encoding='utf-8')
titles = [html.unescape(re.sub('<[^>]+>', '', item)) for item in re.findall(r'<h1[^>]*>(.*?)</h1>', source, re.S)]
def normalise(text):
    return ''.join(c.lower() for c in unicodedata.normalize('NFKD', text) if c.isalnum())
results = []
for name in ['public-full', 'private-full', 'public-compact']:
    reader = PdfReader(folder / (name + '.pdf'))
    texts = [page.extract_text() or '' for page in reader.pages]
    combined = normalise(' '.join(texts))
    missing = [title for title in titles if normalise(title) not in combined]
    blank = [i+1 for i, text in enumerate(texts) if len(re.sub(r'Page\s+\d+\s*/\s*\d+', '',text).strip()) < 10]
    numbering = [i+1 for i,text in enumerate(texts) if not re.search(r'Page\s+'+str(i+1)+r'\s*/\s*'+str(len(texts))+r'\b',text)]
    links = sum(1 for page in reader.pages for ref in page.get('/Annots',[]) if ref.get_object().get('/Subtype') == '/Link')
    assert not missing, (name, 'Missing headings', missing)
    assert not numbering, (name, 'Incorrect page numbering',numbering)
    assert not blank, (name, 'Blank pages',blank)
    assert links > 100, (name,'Missing hyperlinks',links)
    results.append(dict(name=name,pages=len(texts),headings_checked=len(titles),links=links,blank_pages=blank,missing_headings=missing))
    (folder / (name + '-text.txt')).write_text('\n\f\n'.join(texts),encoding='utf-8')

# Kontaktark indeholder samtlige rasteriserede sider i den fulde private udgave.
images = sorted((folder / 'pages').glob('private-*.png'))
for start in range(0,len(images),20):
    sheet = Image.new('RGB',(1500,1760),'#ccd2d7')
    draw = ImageDraw.Draw(sheet)
    for index,file in enumerate(images[start:start+20]):
        picture = Image.open(file).convert('RGB')
        picture.thumbnail((290,405))
        x=(index%5)*300+(300-picture.width)//2
        y=(index//5)*440+25
        sheet.paste(picture,(x,y))
        draw.text(((index%5)*300+10,(index//5)*440+5),f'Page {start+index+1}',fill='black')
    sheet.save(folder / f'contact-{start//20+1:02}.jpg',quality=88)
(folder / 'pdf-results.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
print(json.dumps(results,indent=2))
print(f'{len(images)} pages rendered; {(len(images)+19)//20} contact sheets.')
