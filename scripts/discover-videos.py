from pathlib import Path
from bs4 import BeautifulSoup
import re, json, html
root=Path(__file__).resolve().parent.parent
inventory=[]
for p in (root/'research').glob('*.html'):
    if p.stem=='omnibees': continue
    source=p.read_text(encoding='utf8')
    doc=BeautifulSoup(source,'html.parser')
    urls=set(re.findall(r'https?://[^\s\"\'<>\\]+?\.(?:mp4|webm|m3u8)(?:\?[^\s\"\'<>\\]*)?',html.unescape(source)))
    embeds=[str(tag)[:3500] for tag in doc.select('video,iframe,[data-video-url],[data-video-id]') if 'video' in str(tag).lower() or 'youtube' in str(tag).lower() or 'vimeo' in str(tag).lower()]
    for match in re.finditer(r'video(?:Data|Id|Url|Source)|youtube.com/embed|vimeo.com|\.mp4|\.webm',source,re.I):
        context=source[max(0,match.start()-150):match.end()+400]
        if not urls and len(embeds)<10: embeds.append(context)
    inventory.append({'page':p.stem,'urls':sorted(urls),'embeds':embeds})
(root/'research/video-discovery.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(inventory,ensure_ascii=False,indent=2))
