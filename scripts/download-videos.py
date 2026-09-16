from pathlib import Path
from bs4 import BeautifulSoup
from datetime import datetime,timezone
from concurrent.futures import ThreadPoolExecutor
import requests,json,hashlib
ROOT=Path(__file__).resolve().parent.parent
folder=ROOT/'research/videos/originals'
folder.mkdir(parents=True,exist_ok=True)
headers={'User-Agent':'Mozilla/5.0'}
r=requests.get('https://www.ranchotexasubatuba.com.br/',headers=headers,timeout=40)
r.raise_for_status()
doc=BeautifulSoup(r.content,'html.parser')
videos=[]
for video in doc.select('video'):
    url=video.get('src') or video.get('data-src') or video.get('data-video-src')
    if not url: continue
    videos.append({'url':url,'poster':video.get('poster'),'uploadDate':datetime.fromtimestamp(int(video['data-upload-date'])/1000,timezone.utc).isoformat() if video.get('data-upload-date') else None,'file':hashlib.sha256(url.encode()).hexdigest()[:12]+'.mp4'})
def download(video):
    path=folder/video['file']
    if not path.exists():
        with requests.get(video['url'],headers=headers,stream=True,timeout=90) as response:
            response.raise_for_status()
            with path.open('wb') as f:
                for chunk in response.iter_content(1024*1024):f.write(chunk)
    video['bytes']=path.stat().st_size
    return video
videos=list(ThreadPoolExecutor(max_workers=3).map(download,videos))
(ROOT/'research/videos/sources.json').write_text(json.dumps(videos,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(videos,ensure_ascii=False,indent=2))
