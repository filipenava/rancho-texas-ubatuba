"""Prepara todas as fotografias do site original em álbuns navegáveis.

As 29 imagens usadas dentro das páginas continuam em `prepare-images.py`, com
quatro larguras e srcset. Aqui tratamos o acervo completo: três larguras por
foto (miniatura, grade e lightbox), porque o uso é sempre o mesmo em qualquer viewport.

Excluímos apenas o que não é fotografia: logos, o selo da Omnibees, os cartões
e prints de avaliação e o mapa turístico da cidade.
"""

from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parent.parent
assets = json.loads((ROOT / 'research/assets.json').read_text(encoding='utf8'))
by_id = {a['id']: a for a in assets}

# Não são fotografias da pousada.
EXCLUDE = {0, 29, 30, 32, 33, 35, 40, 44, 183, 184, 210}


def span(*ranges):
    out = set()
    for start, end in ranges:
        out.update(range(start, end + 1))
    return out


ALBUMS = {
    'acomodacoes': {
        'title': 'Acomodações',
        'heading': 'Suítes, quartos e a estrutura de hospedagem',
        'description': 'Fotos das suítes do Rancho Texas Ubatuba por dentro: Duplex, Eco Bloco, Standard, da Roça e Casa Rosa, com os blocos, corredores e varandas.',
        'intro': ['As 74 fotografias deste álbum mostram as cinco categorias de suíte por dentro, dos 18 m² da Standard sem janela aos 80 m² da Casa Rosa, com varanda. Aparecem também os blocos externos, os corredores, os banheiros e as varandas que ligam os quartos ao verde.', 'Todas as acomodações têm ar-condicionado, TV e Wi-Fi, e o café da manhã está incluso na hospedagem. A disposição dos móveis pode variar entre unidades da mesma categoria.'],
        'alt': 'Acomodação do Rancho Texas Ubatuba',
        'ids': span((47, 55), (57, 74), (79, 116), (118, 125)) | {77},
    },
    'fazendinha': {
        'title': 'Fazendinha',
        'heading': 'Os animais que moram no Rancho',
        'description': 'Fotos dos animais da fazendinha do Rancho Texas Ubatuba: ovelhas, cabras, o pônei João Floquinho, bezerros, patos, galinhas e o pavão-branco.',
        'intro': ['A fazendinha é o encontro que as crianças lembram muito tempo depois. Aqui moram a ovelha Vitória, a cabrinha Lívia, a cabra Dona Jô e o pônei João Floquinho, além dos bezerros, das galinhas, dos patos do lago e de um pavão-branco.', 'As visitas seguem as orientações da equipe e as crianças devem estar acompanhadas de um responsável. A alimentação dos animais é feita com o que o Rancho fornece.'],
        'alt': 'Animal da fazendinha do Rancho Texas Ubatuba',
        'ids': {43, 161, 165, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 212},
    },
    'aves': {
        'title': 'Aves',
        'heading': 'A avifauna da Mata Atlântica em Ubatuba',
        'description': 'Aves da Mata Atlântica fotografadas em Ubatuba: saíras-sete-cores, sabiás, tiês-sangue, garças e outras espécies da Serra do Mar.',
        'intro': ['Ubatuba está em uma das áreas mais preservadas da Mata Atlântica do Brasil, com mais de 500 espécies de aves registradas. Neste álbum aparecem saíras-sete-cores, sabiás-laranjeira, sabiás-barranco, tiês-sangue, garças, sanhaços e outras espécies da região.', 'O melhor horário para observar é entre 6h e 9h, quando as aves estão mais ativas e a luz favorece a fotografia. Os meses de abril a junho e setembro são os mais indicados.'],
        'alt': 'Ave da Mata Atlântica registrada em Ubatuba',
        'ids': span((1, 28)),
    },
    'natureza': {
        'title': 'Natureza',
        'heading': 'Rio, lago, mata e as flores do Rancho',
        'description': 'O rio, o lago, a Mata Atlântica e as flores do Rancho Texas Ubatuba, além das paisagens da Serra do Mar no entorno da pousada.',
        'intro': ['O Rancho fica cercado de verde, com um rio de águas claras correndo pelo terreno e um lago que muda de cor ao longo do dia. Este álbum reúne as paisagens da propriedade e do entorno: a mata, as encostas da Serra do Mar, as orquídeas e helicônias do jardim e as praias de Ubatuba.', 'A Cachoeira do Pé da Serra fica a cerca de 2 km, na mesma região da Rodovia Oswaldo Cruz.'],
        'alt': 'Paisagem natural no Rancho Texas Ubatuba',
        'ids': span((135, 141), (155, 159), (195, 209))
        | {34, 39, 41, 46, 56, 75, 133, 152, 211},
    },
    'lazer': {
        'title': 'Piscina e lazer',
        'heading': 'Piscina, pesqueiro e parquinho',
        'description': 'A piscina ao ar livre, o pesqueiro e o parquinho do Rancho Texas Ubatuba, nas fotos do acervo da própria pousada.',
        'intro': ['A piscina fica cercada pelo verde e é o ponto de encontro das tardes quentes. O pesqueiro, à beira do lago, é para quem prefere desacelerar de vez, e o parquinho garante o lugar das crianças.', 'As condições de uso de cada área dependem do clima e das orientações da equipe. Consulte na chegada.'],
        'alt': 'Área de lazer do Rancho Texas Ubatuba',
        'ids': {37, 38, 76, 78, 153, 154, 162, 166},
    },
    'camping': {
        'title': 'Camping',
        'heading': 'A área de campistas do Rancho',
        'description': 'A área de camping do Rancho Texas Ubatuba em dias cheios e tranquilos, com barracas montadas no gramado em meio ao verde.',
        'intro': ['O Rancho tem ampla área para campistas, com infraestrutura e acesso ao lazer da pousada. Basta uma barraca, um kit básico de acampamento e vontade de estar perto da natureza.', 'Há a opção de camping com café da manhã incluso. Confirme com a equipe a disponibilidade, os pontos de energia, os banheiros e as regras para veículos antes da viagem.'],
        'alt': 'Área de camping do Rancho Texas Ubatuba',
        'ids': span((126, 132), (142, 151)),
    },
    'gastronomia': {
        'title': 'Gastronomia',
        'heading': 'Café da manhã, restaurante e a costela de chão',
        'description': 'O café da manhã incluso, a mesa de frutas, os pães de queijo e a costela no fogo de chão do restaurante do Rancho Texas Ubatuba.',
        'intro': ['O café da manhã está incluso na hospedagem e é servido das 7h às 9h. A mesa tem frutas da estação, bolos, pães de queijo e o café fresco que dá o tom da manhã.', 'O restaurante serve pratos típicos durante a estadia, e a costela no fogo de chão é o que os hóspedes mais citam nas avaliações.'],
        'alt': 'Prato ou mesa do restaurante do Rancho Texas Ubatuba',
        'ids': {36, 42, 117, 160, 163, 164, 167, 168, 169},
    },
    'casamentos': {
        'title': 'Casamentos',
        'heading': 'Cerimônias e festas no Rancho',
        'description': 'Cerimônias, decoração e festas de casamento realizadas no Rancho Texas Ubatuba, em meio à natureza da Mata Atlântica.',
        'intro': ['No Rancho, cerimônia, festa e hospedagem acontecem no mesmo lugar. Os convidados não precisam pegar a estrada no fim da noite e vocês ganham mais tempo com quem veio de longe.', 'Capacidade, fornecedores, decoração e alimentação são definidos em consulta com a equipe. Solicite uma proposta para a sua data.'],
        'alt': 'Casamento realizado no Rancho Texas Ubatuba',
        'ids': span((185, 194)) | {170},
    },
}

out_dir = ROOT / 'public/images/album'
out_dir.mkdir(parents=True, exist_ok=True)

manifest = {}
assigned = set()
for slug, album in ALBUMS.items():
    photos = []
    for aid in sorted(album['ids']):
        if aid in EXCLUDE or aid not in by_id:
            continue
        asset = by_id[aid]
        path = ROOT / 'research/originals' / asset['file']
        if not path.exists():
            continue
        assigned.add(aid)
        im = Image.open(path).convert('RGB')
        for width in (320, 560, 1600):
            resized = im.copy()
            resized.thumbnail((width, round(width * im.height / im.width)))
            resized.save(
                out_dir / f'{aid}-{width}.webp', 'WEBP', quality=74, method=4
            )
        photos.append({'id': aid, 'width': im.width, 'height': im.height})
    manifest[slug] = {
        'title': album['title'],
        'heading': album['heading'],
        'description': album['description'],
        'intro': album['intro'],
        'alt': album['alt'],
        'photos': photos,
    }

leftover = sorted(
    a['id']
    for a in assets
    if a['id'] not in assigned
    and a['id'] not in EXCLUDE
    and (ROOT / 'research/originals' / a.get('file', '')).exists()
)
(ROOT / 'src/data/albums.json').write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf8'
)
total = sum(len(a['photos']) for a in manifest.values())
print(f'{total} fotografias em {len(manifest)} álbuns')
if leftover:
    print(f'sem álbum: {leftover}')
