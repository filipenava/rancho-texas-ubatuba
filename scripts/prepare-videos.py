"""Create silent ambient clips; retain unmodified source videos outside public/."""
from pathlib import Path
import json,subprocess,imageio_ffmpeg
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'public/videos'
OUT.mkdir(exist_ok=True)
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
sources=json.loads((ROOT/'research/videos/sources.json').read_text(encoding='utf8'))
selected=[('ubatuba',sources[0]),('fazendinha',sources[1])]
result={}
for name,source in selected:
    original=ROOT/'research/videos/originals'/source['file']
    width,height=source['metadata']['size']
    outputs={}
    for target in [640,960]:
        file=OUT/f'{name}-{target}.mp4'
        subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(original),'-map','0:v:0','-an','-vf',f'scale={target}:-2,fps=24','-c:v','libx264','-preset','slow','-crf','27','-pix_fmt','yuv420p','-movflags','+faststart',str(file)],check=True)
        outputs[str(target)]=file.stat().st_size
    frame=ROOT/'research/videos'/f'{name}-poster.png'
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-ss','0.5','-i',str(original),'-frames:v','1',str(frame)],check=True)
    for target in [640,960]:
        im=Image.open(frame);im.thumbnail((target,round(target*height/width)))
        im.save(OUT/f'{name}-poster-{target}.webp',quality=78,method=6)
    result[name]={'original':source['url'],'originalBytes':source['bytes'],'uploadDate':source['uploadDate'],'duration':round(source['metadata']['duration'],2),'width':width,'height':height,'outputs':outputs}
(ROOT/'src/data/video-assets.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(result,ensure_ascii=False,indent=2))
