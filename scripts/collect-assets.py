from pathlib import Path
import requests, json, re, hashlib
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, unquote
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'research'
OUT.mkdir(exist_ok=True)
BASE = 'https://www.ranchotexasubatuba.com.br/'
session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0'
html = session.get(BASE, timeout=45).content.decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')
pages = {'home': BASE}
for a in soup.select('a[href]'):
    url = urljoin(BASE, a['href'])
    if urlparse(url).netloc == urlparse(BASE).netloc and urlparse(url).path not in ('', '/'):
        pages[unquote(urlparse(url).path.strip('/'))] = url.split('#')[0]

def read_page(item):
    name, url = item
    try:
        source = session.get(url, timeout=45).content.decode('utf-8')
        (OUT / (name.replace('/', '_') + '.html')).write_text(source, encoding='utf-8')
        doc = BeautifulSoup(source, 'html.parser')
        (OUT / (name.replace('/', '_') + '.txt')).write_text(doc.get_text(' ', strip=True), encoding='utf-8')
        assets = []
        for el in doc.select('img'):
            src = el.get('src') or el.get('data-src') or ''
            if 'cdn-website.com' in src:
                assets.append({'url': src, 'alt': el.get('alt', ''), 'page': name})
        for src in re.findall(r'https?://[^\s\"\'<>\)]+', source):
            if 'cdn-website.com' in src and re.search(r'\.(jpg|jpeg|png|webp)', src, re.I):
                assets.append({'url': src.replace('&amp;', '&'), 'alt': '', 'page': name})
        return {'page': name, 'url': url, 'assets': assets, 'colors': re.findall(r'#[0-9a-fA-F]{6}\b', source), 'booking': list(set(a['href'] for a in doc.select('a[href]') if 'omnibees' in a['href']))}
    except Exception as e:
        return {'page': name, 'error': str(e)}

results = list(ThreadPoolExecutor(max_workers=6).map(read_page, pages.items()))
(OUT / 'inventory.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps([{'page': r['page'], 'images': len(r.get('assets', [])), 'booking': r.get('booking', []), 'error': r.get('error')} for r in results], ensure_ascii=False, indent=2))
