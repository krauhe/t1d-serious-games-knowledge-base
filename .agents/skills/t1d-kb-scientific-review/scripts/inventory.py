"""Inventory review inputs without treating mechanical flags as scientific findings.

Reads only explicit knowledge-base sources and local articles. Generated metadata
and optional article text go to the specified output directory, never into the
website sources. PDF/HTML extraction needs PyMuPDF/BeautifulSoup respectively.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--extract-articles', action='store_true')
    args = parser.parse_args()
    root, output = args.root.resolve(), args.output.resolve()
    if output == root or output in root.parents:
        raise ValueError('Output must be a dedicated working subdirectory.')
    if args.extract_articles and 'private-literature' not in output.parts and '.validation' not in output.parts:
        raise ValueError('Extracted article text must remain in an ignored private working directory.')
    output.mkdir(parents=True, exist_ok=True)
    navigation = json.loads((root / 'data/navigation.json').read_text(encoding='utf-8-sig'))
    names = [i['source'] for group in navigation for i in group['items'] if 'source' in i]
    names += ['README.md', 'EDITORIAL-POLICY.md', 'GOVERNANCE.md', 'CONTRIBUTING.md', 'LICENSING.md', 'CITATION.cff']
    names = list(dict.fromkeys(names))
    sources, paragraphs, url_index, reading = [], [], {}, []
    for name in names:
        path = root / name
        body = path.read_text(encoding='utf-8-sig')
        lines = body.splitlines()
        sources.append({'path': name, 'lines': len(lines), 'words': len(body.split()), 'sha256': digest(path), 'review_status': 'pending'})
        reading.append('\n\nFILE: ' + name + '\n' + '\n'.join(f'{n}: {line}' for n, line in enumerate(lines, 1)))
        in_references, fenced, pending, start = False, False, [], 0
        def flush():
            if not pending:
                return
            text = ' '.join(pending)
            if len(text.split()) >= 15 and not text.startswith(('#', '|', ':::')):
                paragraphs.append({'path': name, 'line': start, 'text': text, 'has_link': bool(re.search(r'https?://', text)), 'in_references': in_references, 'inference_label': bool(re.search(r'inference|hypothes|propos|industry practice', text, re.I))})
            pending.clear()
        for n, line in enumerate(lines, 1):
            if re.match(r'^```', line):
                flush()
                fenced = not fenced
                continue
            if fenced:
                continue
            if re.match(r'^#{1,3} References', line):
                flush()
                in_references = True
            elif line.startswith('#'):
                flush()
                in_references = False
            for match in re.finditer(r'\[([^\]\n]+)\]\((https?://(?:[^()\s]|\([^)]*\))+?)\)', line):
                label, url = match.groups()
                url_index.setdefault(url, []).append({'path': name, 'line': n, 'label': label, 'reference_list': in_references})
            if not line.strip():
                flush()
            else:
                if not pending:
                    start = n
                pending.append(line.strip())
        flush()
    games = json.loads((root / 'data/games.json').read_text(encoding='utf-8-sig'))['games']
    for game in games:
        for kind, urls in game.get('links', {}).items():
            for url in urls:
                url_index.setdefault(url, []).append({'path': 'data/games.json', 'game_id': game['id'], 'label': game['title'], 'kind': kind})
    articles = []
    if args.extract_articles:
        import pymupdf as fitz
        from bs4 import BeautifulSoup
        (output / 'article-text').mkdir(exist_ok=True)
    for path in sorted((root / 'private-literature/articles').glob('*')):
        if not path.is_file():
            continue
        item = {'path': path.relative_to(root).as_posix(), 'bytes': path.stat().st_size, 'sha256': digest(path)}
        if args.extract_articles:
            try:
                if path.suffix.lower() == '.pdf':
                    with fitz.open(path) as doc:
                        item['pages'] = len(doc)
                        txt = '\n\n'.join(f'PAGE {p.number+1}\n{p.get_text()}' for p in doc)
                elif path.suffix.lower() in ('.html', '.xml'):
                    soup = BeautifulSoup(path.read_text(encoding='utf-8', errors='replace'), 'html.parser')
                    for elem in soup(['script', 'style', 'nav']):
                        elem.decompose()
                    txt = soup.get_text(' ', strip=True)
                else:
                    continue
                item['extracted_characters'] = len(txt)
                item['doi_candidates'] = sorted(set(re.findall(r'10\.\d{4,9}/[-._;()/:A-Z0-9]+', txt[:18000], re.I)))[:20]
                item['extraction'] = path.stem + '.md'
                (output / 'article-text' / item['extraction']).write_text(txt, encoding='utf-8')
            except Exception as exc:
                item['extraction_error'] = str(exc)
        articles.append(item)
    result = {'generated_at': datetime.now(timezone.utc).isoformat(), 'sources': sources, 'games': games, 'paragraphs': paragraphs, 'urls': [{'url': u, 'locations': v} for u, v in url_index.items()], 'articles': articles}
    (output / 'inventory.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    (output / 'reading-corpus.md').write_text(''.join(reading), encoding='utf-8')
    print(json.dumps({'documents': len(sources), 'games': len(games), 'words': sum(s['words'] for s in sources), 'urls': len(url_index), 'article_files': len(articles), 'paragraphs_for_human_inspection': len(paragraphs), 'output': str(output)}, indent=2))


if __name__ == '__main__':
    main()
