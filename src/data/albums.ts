import data from './albums.json';

export type AlbumPhoto = { id: number; width: number; height: number };
export type Album = {
  slug: string;
  title: string;
  heading: string;
  description: string;
  /** Parágrafos da página do álbum. Sem eles a página fica só de imagens. */
  intro: string[];
  /** Base do texto alternativo das fotos deste álbum. */
  alt: string;
  cover: number;
  photos: AlbumPhoto[];
};

/** Foto de capa de cada álbum, escolhida entre as do próprio acervo. */
const covers: Record<string, number> = {
  acomodacoes: 123,
  fazendinha: 173,
  aves: 22,
  natureza: 155,
  lazer: 153,
  camping: 143,
  gastronomia: 42,
  casamentos: 185,
};

/** Ordem de exibição, das seções que mais pesam na decisão de reservar. */
const order = [
  'acomodacoes',
  'natureza',
  'fazendinha',
  'lazer',
  'gastronomia',
  'camping',
  'aves',
  'casamentos',
];

export const albums: Album[] = order.map((slug) => ({
  slug,
  cover: covers[slug],
  ...(data as Record<string, Omit<Album, 'slug' | 'cover'>>)[slug],
}));

export const totalPhotos = albums.reduce((n, a) => n + a.photos.length, 0);

export const albumSrc = (id: number, width: 320 | 560 | 1600) =>
  `/images/album/${id}-${width}.webp`;

/** Miniatura e grade na mesma tag: nas grades a menor largura basta em telas pequenas. */
export const albumSrcset = (id: number) =>
  `${albumSrc(id, 320)} 320w, ${albumSrc(id, 560)} 560w`;
