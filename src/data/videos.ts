import assets from './video-assets.json';

export const videos = {
  fazendinha: {
    ...assets.fazendinha,
    slug: 'fazendinha-em-familia',
    title: 'Pequenos encontros na fazendinha',
    label: 'AFETO EM CADA DESCOBERTA',
    description:
      'Crianças conhecem e alimentam os animais da fazendinha do Rancho Texas, acompanhadas por adultos, em duas cenas de curiosidade e sorrisos.',
    context:
      'Um pedacinho da vida no campo para conhecer antes de chegar. Visitas e alimentação dos animais seguem as orientações da equipe do Rancho.',
    related: '/fazendinha',
    relatedLabel: 'Conheça a fazendinha',
  },
  ubatuba: {
    ...assets.ubatuba,
    slug: 'paisagens-de-ubatuba',
    title: 'O mar e o ritmo de Ubatuba',
    label: 'UM RESPIRO NO LITORAL',
    description:
      'As ondas chegam à areia em uma paisagem de Ubatuba, com árvores em primeiro plano e montanhas ao fundo, no litoral norte de São Paulo.',
    context:
      'As imagens mostram o litoral de Ubatuba. O Rancho Texas fica no Horto Florestal, na Rodovia Oswaldo Cruz; a pousada não é à beira-mar.',
    related: '/natureza',
    relatedLabel: 'Explore natureza e lazer',
  },
};
export type VideoName = keyof typeof videos;
