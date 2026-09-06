"""Typeset the audit HTML as a linked, paginated scientific PDF.

The input is the separately generated audit, not the public website. A temporary
PDF is stamped with the final page count, then every page can be rasterised for
manual layout inspection using this script's --inspect option.
"""
import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import unquote
from bs4 import BeautifulSoup, NavigableString
import pymupdf
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[3]
HTML = ROOT/'output/reviews/2026-09-06_scientific-content-audit.html'
PDF = ROOT/'output/pdf/AIReview - 2026-09-06 - Scientific Content Audit.pdf'
WORK = ROOT/'.validation/review-2026-09-06/pdf'

def inline(node):
    if isinstance(node, NavigableString):
        text = str(node).replace('\u2011','-').replace('\u2013','-').replace('\u2014',' - ')
        return html.escape(text)
    content = ''.join(inline(n) for n in node.children)
    if node.name in ['strong','b']: return '<b>'+content+'</b>'
    if node.name in ['em','i']: return '<i>'+content+'</i>'
    if node.name == 'code': return '<font size="8.4" color="#52616C">'+content+'</font>'
    if node.name == 'br': return '<br/>'
    if node.name == 'a':
        target = node.get('href','')
        if target and not re.match(r'^(https?:|mailto:|#)',target):
            target = (HTML.parent/unquote(target)).resolve().as_uri()
        return '<a href="'+html.escape(target,quote=True)+'" color="#176BA5">'+content+'</a>'
    return content

class AuditDocument(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and hasattr(flowable, 'outline_id'):
            self.canv.bookmarkPage(flowable.outline_id)
            self.canv.addOutlineEntry(flowable.getPlainText(), flowable.outline_id, level=0, closed=False)

def render():
    WORK.mkdir(parents=True,exist_ok=True)
    PDF.parent.mkdir(parents=True,exist_ok=True)
    for name,filename in [('Audit','arial.ttf'),('Audit-Bold','arialbd.ttf'),('Audit-Italic','ariali.ttf'),('Audit-BoldItalic','arialbi.ttf')]:
        pdfmetrics.registerFont(TTFont(name,str(Path('C:/Windows/Fonts')/filename)))
    pdfmetrics.registerFontFamily('Audit',normal='Audit',bold='Audit-Bold',italic='Audit-Italic',boldItalic='Audit-BoldItalic')
    base = ParagraphStyle('Body',fontName='Audit',fontSize=9.8,leading=14.4,textColor=colors.HexColor('#233B4D'),spaceAfter=9,splitLongWords=True,allowWidows=0,allowOrphans=0)
    styles = {
        'p':base,
        'h1':ParagraphStyle('H1',parent=base,fontName='Audit-Bold',fontSize=29,leading=34,spaceAfter=12,keepWithNext=True),
        'h2':ParagraphStyle('H2',parent=base,fontName='Audit-Bold',fontSize=16.5,leading=21,spaceBefore=17,spaceAfter=10,keepWithNext=True),
        'h3':ParagraphStyle('H3',parent=base,fontName='Audit-Bold',fontSize=11.7,leading=16,spaceBefore=15,spaceAfter=8,textColor=colors.HexColor('#087D77'),keepWithNext=True),
        'li':ParagraphStyle('List',parent=base,leftIndent=15,firstLineIndent=-12,spaceAfter=7),
        'cell':ParagraphStyle('Cell',parent=base,fontSize=8.1,leading=11,spaceAfter=0),
        'th':ParagraphStyle('TH',parent=base,fontName='Audit-Bold',fontSize=8.1,leading=11,textColor=colors.white,spaceAfter=0),
    }
    soup = BeautifulSoup(HTML.read_text(encoding='utf-8'),'html.parser')
    story=[]
    for node in soup.main.children:
        if isinstance(node,NavigableString) or node.name == 'footer': continue
        if node.name in ['h1','h2','h3','p']:
            p=Paragraph(inline(node),styles[node.name])
            if node.name.startswith('h'):
                p.outline_id=node.get('id')
            story.append(p)
        elif node.name in ['ol','ul']:
            for i,item in enumerate(node.find_all('li',recursive=False),1):
                prefix = str(i)+'. ' if node.name == 'ol' else '- '
                story.append(Paragraph(prefix+inline(item),styles['li']))
        elif node.name == 'table':
            rows=[]
            for row in node.find_all('tr'):
                rows.append([Paragraph(inline(c), styles['th' if c.name=='th' else 'cell']) for c in row.find_all(['td','th'],recursive=False)])
            table=Table(rows,colWidths=[131,86,270],repeatRows=1,hAlign='LEFT')
            table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#1B4C5C')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#F0F5F6')]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('GRID',(0,0),(-1,-1),.4,colors.HexColor('#D5DFE4'))]))
            story.extend([Spacer(1,6),table,Spacer(1,10)])
        else:
            raise ValueError('Unsupported block: '+node.name)
    def furniture(canvas,doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#44A89E'))
        canvas.setLineWidth(1.3)
        canvas.line(54, A4[1]-39, A4[0]-54,A4[1]-39)
        canvas.setFont('Audit',7.4)
        canvas.setFillColor(colors.HexColor('#59707F'))
        canvas.drawString(54,A4[1]-30,'T1D SERIOUS GAMES KNOWLEDGE BASE  /  SCIENTIFIC AUDIT')
        canvas.drawRightString(A4[0]-54,A4[1]-30,'6 SEPTEMBER 2026')
        canvas.restoreState()
    draft=WORK/'draft.pdf'
    doc=AuditDocument(str(draft),pagesize=A4,leftMargin=54,rightMargin=54,topMargin=57,bottomMargin=52,title='Scientific Content Audit - T1D Serious Games Knowledge Base',author='Codex scientific audit',pageCompression=1)
    doc.build(story,onFirstPage=furniture,onLaterPages=furniture)
    with pymupdf.open(draft) as pdf:
        for i,page in enumerate(pdf,1):
            page.insert_text((54,A4[1]-28),'Review findings remain open in the scientific content.',fontsize=7.5,color=(.35,.43,.48))
            page.insert_textbox(pymupdf.Rect(420,A4[1]-37,A4[0]-54,A4[1]-18),f'Page {i} / {len(pdf)}',fontsize=8,align=2,color=(.25,.35,.4))
        pdf.save(PDF,deflate=True)
    print(PDF)

def inspect():
    from PIL import Image, ImageOps, ImageDraw
    WORK.mkdir(parents=True,exist_ok=True)
    with pymupdf.open(PDF) as pdf:
        report={'pages':len(pdf),'links':sum(len(p.get_links()) for p in pdf),'page_numbers':[], 'layout_issues':[]}
        previews=[]
        for i,page in enumerate(pdf,1):
            text=page.get_text()
            report['page_numbers'].append(f'Page {i} / {len(pdf)}' in text)
            for block in page.get_text('blocks'):
                if block[0] < 45 or block[2] > A4[0]-44 or block[1] < 15 or block[3] > A4[1]-14:
                    report['layout_issues'].append({'page':i,'bounds':block[:4],'text':block[4][:70]})
            pix=page.get_pixmap(matrix=pymupdf.Matrix(1.35,1.35),alpha=False)
            filename=WORK/f'page-{i:02d}.png'
            pix.save(filename)
            previews.append(Image.open(filename).convert('RGB'))
        for start in range(0,len(previews),4):
            subset=previews[start:start+4]
            w,h=subset[0].size
            sheet=Image.new('RGB',(2*w+30,2*(h+30)+30),'#cbd5dc')
            draw=ImageDraw.Draw(sheet)
            for offset,img in enumerate(subset):
                x=10+(offset%2)*(w+10); y=10+(offset//2)*(h+30)
                sheet.paste(img,(x,y+20)); draw.text((x+8,y+3),f'PAGE {start+offset+1}',fill='black')
            sheet.save(WORK/f'contact-{start//4+1:02d}.jpg',quality=90)
        (WORK/'validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        assert all(report['page_numbers']), 'Missing page numbering'
        assert report['links'] > 25, 'Missing linked references'
        print(json.dumps(report,indent=2))

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--inspect',action='store_true')
    args=parser.parse_args()
    inspect() if args.inspect else render()
