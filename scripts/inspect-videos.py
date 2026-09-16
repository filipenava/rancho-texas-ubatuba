from pathlib import Path
import imageio_ffmpeg, json, subprocess
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parent.parent
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
data=json.loads((ROOT/'research/videos/sources.json').read_text(encoding='utf8'))
for v in data:
    path=ROOT/'research/videos/originals'/v['file']
    reader=imageio_ffmpeg.read_frames(str(path))
    meta=next(reader); reader.close()
    v['metadata']=meta
    sheet=Image.new('RGB',(1200,440),'#eee');draw=ImageDraw.Draw(sheet)
    for i,frac in enumerate([.03,.18,.34,.5,.67,.85]):
        frame=ROOT/'research/videos'/f"{path.stem}-{i}.jpg"
        subprocess.run([ffmpeg,'-y','-ss',str(meta['duration']*frac),'-i',str(path),'-frames:v','1','-vf','scale=480:-1',str(frame)],capture_output=True,check=True)
        im=ImageOps.contain(Image.open(frame),(390,195))
        x=(i%3)*400;y=(i//3)*220
        sheet.paste(im,(x,y));draw.text((x,y+195),f"{meta['duration']*frac:.1f}s",fill='black')
    sheet.save(ROOT/'research/videos'/f'{path.stem}-sheet.jpg')
(ROOT/'research/videos/sources.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps([{'file':v['file'],'metadata':v['metadata']} for v in data],indent=2))
