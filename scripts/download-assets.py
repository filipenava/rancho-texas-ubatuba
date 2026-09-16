from pathlib import Path
import requests, json, re, hashlib, io
from PIL import Image, ImageOps, ImageDraw
from concurrent.futures import ThreadPoolExecutor
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / 'research/inventory.json').read_text(encoding='utf-8'))
folder = ROOT / 'research/originals'
folder.mkdir(parents=True, exist_ok=True)
assets = {}
for page in data:
    for asset in page.get('assets', []):
        url = asset['url'].split('?')[0]
        key = re.sub(r'-\d+w\.', '.', url.split('/')[-1])
        if key not in assets: assets[key] = asset | {'pages': [page['page']]}
        elif page['page'] not in assets[key]['pages']: assets[key]['pages'].append(page['page'])

def download(item):
    index, (key, asset) = item
    try:
        url = asset['url']
        res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=40)
        res.raise_for_status()
        im = Image.open(io.BytesIO(res.content))
        ext = (im.format or 'jpg').lower().replace('jpeg', 'jpg')
        name = f'{index:03d}-{hashlib.sha256(key.encode()).hexdigest()[:8]}.{ext}'
        (folder / name).write_bytes(res.content)
        return asset | {'id': index, 'file': name, 'width': im.width, 'height': im.height}
    except Exception as e:
        return asset | {'id': index, 'error': str(e)}

downloaded = list(ThreadPoolExecutor(max_workers=10).map(download, enumerate(assets.items())))
(ROOT / 'research/assets.json').write_text(json.dumps(downloaded, ensure_ascii=False, indent=2), encoding='utf-8')
good = [a for a in downloaded if 'file' in a]
sheets = ROOT / 'research/contact-sheets'
sheets.mkdir(exist_ok=True)
for start in range(0, len(good), 60):
    batch = good[start:start+60]
    sheet = Image.new('RGB', (1200, ((len(batch)+5)//6)*150), '#eeeeee')
    draw = ImageDraw.Draw(sheet)
    for n, a in enumerate(batch):
        im = Image.open(folder/a['file']).convert('RGB')
        thumb = ImageOps.contain(im, (190, 120))
        x,y = (n%6)*200, (n//6)*150
        sheet.paste(thumb, (x,y))
        draw.text((x+3,y+122), f"{a['id']} {a['width']}x{a['height']}", fill='black')
    sheet.save(sheets/f'sheet-{start//60}.jpg')
print(json.dumps({'downloaded': len(good), 'errors': [a for a in downloaded if 'error' in a], 'colors': Counter(c.lower() for p in data for c in p.get('colors', [])).most_common(20)}, ensure_ascii=False))
