from pathlib import Path
from PIL import Image, ImageOps
import json, shutil
ROOT = Path(__file__).resolve().parent.parent
assets = json.loads((ROOT/'research/assets.json').read_text(encoding='utf8'))
chosen = { 'logo':0, 'rancho-lago':46, 'piscina':153, 'fazendinha':173, 'cabrinha':161, 'ovelha':172, 'ponei':176, 'suite-duplex':47, 'suite-eco':65, 'suite-standard':83, 'suite-roca':115, 'suite-casa-rosa':120, 'camping':143, 'rio':155, 'mata-atlantica':198, 'passaros':21, 'cafe-da-manha':168, 'restaurante':160, 'casamentos':194, 'jardim':157, 'parquinho':166, 'praia':41, 'pesqueiro':162, 'cabra':175, 'pavao':181, 'costela':164, 'casamento-cerimonia':192, 'vaquinhas':179, 'lago-patos':159 }
manifest = {}
for name, aid in chosen.items():
    a = next(x for x in assets if x['id']==aid)
    im = Image.open(ROOT/'research/originals'/a['file'])
    if name == 'logo':
        im.save(ROOT/'public/images/logo.png')
        # Favicon dedicado: o logo de 500px pesa ~180 KB e era o maior recurso da home.
        icon = im.copy(); icon.thumbnail((96,96))
        icon.save(ROOT/'public/images/favicon.png','PNG',optimize=True)
        im.thumbnail((240,240))
        im.save(ROOT/'public/images/logo.webp','WEBP',quality=90,method=6)
        continue
    im = im.convert('RGB')
    for width in [400, 640, 800, 1200, 1920]:
        resized = im.copy()
        resized.thumbnail((width, round(width*im.height/im.width)))
        resized.save(ROOT/f'public/images/{name}-{width}.webp', 'WEBP', quality=76,method=6)
    if name == 'rancho-lago':
        for width in [480,800]:
            mobile=ImageOps.fit(im,(width,round(width*570/412)),centering=(.57,.5))
            mobile.save(ROOT/f'public/images/hero-mobile-{width}.webp','WEBP',quality=76,method=6)
    manifest[name] = {'source': a['url'], 'width': im.width, 'height': im.height}
(ROOT/'research/selected-images.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
print(f'{len(chosen)} selected assets prepared')
