export const site = {
  name: 'Rancho Texas Ubatuba',
  legalName: 'Rancho Texas Ubatuba — Pousada e Camping',
  /** Descrição do negócio para o schema. Fixa: o mesmo @id não pode
   *  se descrever de um jeito diferente em cada página. */
  description:
    'Pousada e camping em Ubatuba, no Horto Florestal, com café da manhã incluso, restaurante, piscina, pesqueiro e fazendinha com animais. Fica na entrada da cidade, a 2 km da Cachoeira do Pé da Serra.',
  url: 'https://www.ranchotexasubatuba.com.br',
  whatsapp: 'https://wa.me/5512997740679',
  whatsappAlt: 'https://wa.me/5512996800679',
  phone: '(12) 99774-0679',
  phoneAlt: '(12) 99680-0679',
  landline: '(12) 3042-3177',
  landlineAlt: '(12) 3042-3171',
  email: 'reservas@ranchotexasubatuba.com.br',
  street: 'Rodovia Oswaldo Cruz, km 88,9, nº 5228',
  district: 'Horto Florestal',
  city: 'Ubatuba',
  state: 'SP',
  postalCode: '11680-000',
  address:
    'Rodovia Oswaldo Cruz, km 88,9, nº 5228 — Horto Florestal, Ubatuba – SP',
  geo: { lat: -23.40571, lng: -45.11796 },
  checkIn: '14:00',
  checkOut: '12:00',
  booking:
    'https://book.omnibees.com/hotelresults?c=6369&q=10889&lang=pt-BR&currencyId=16',
  maps: 'https://www.google.com/maps/search/?api=1&query=Rancho+Texas+Ubatuba+Rodovia+Oswaldo+Cruz+5228',
  // Sem place_id público não dá para montar o link direto de escrever
  // avaliação; a ficha do Google abre com o botão de avaliar à mão.
  review:
    'https://www.google.com/maps/search/?api=1&query=Rancho+Texas+Ubatuba+Ubatuba+SP',
  social: {
    instagram: 'https://instagram.com/ranchotexasubatuba/',
    facebook: 'https://www.facebook.com/ranchotexasubatuba1',
    youtube: 'https://www.youtube.com/@ranchotexasubatuba',
  },
};

/** Telefones exibidos em contato e rodapé, com o link já normalizado. */
export const phones = [
  {
    label: site.phone,
    href: site.whatsapp,
    tel: '+5512997740679',
    kind: 'WhatsApp',
    note: 'Reservas e atendimento. A resposta costuma vir por aqui.',
  },
  {
    label: site.phoneAlt,
    href: site.whatsappAlt,
    tel: '+5512996800679',
    kind: 'WhatsApp',
    note: 'Segunda linha, para quando a primeira estiver ocupada.',
  },
  {
    label: site.landline,
    href: 'tel:+551230423177',
    tel: '+551230423177',
    kind: 'Telefone',
    note: 'Recepção e central de reservas.',
  },
  {
    label: site.landlineAlt,
    href: 'tel:+551230423171',
    tel: '+551230423171',
    kind: 'Telefone',
    note: 'Linha alternativa da recepção.',
  },
];

export const nav = [
  { label: 'O Rancho', href: '/#o-rancho' },
  { label: 'Acomodações', href: '/acomodacoes' },
  { label: 'Fazendinha', href: '/fazendinha' },
  { label: 'Camping', href: '/camping' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Como chegar', href: '/contato' },
];

/** O que está incluído ou disponível na pousada. Base do bloco de estrutura e do schema. */
export const amenities = [
  {
    icon: 'coffee',
    title: 'Café da manhã incluso',
    text: 'Servido das 7h às 9h, com frutas, bolos, pães de queijo e café fresco.',
  },
  {
    icon: 'utensils',
    title: 'Restaurante com pratos típicos',
    text: 'Comida de verdade, com o sabor da cozinha do interior, sem precisar sair do Rancho.',
  },
  {
    icon: 'water',
    title: 'Piscina ao ar livre',
    text: 'Um mergulho cercado pelo verde, no ritmo tranquilo de quem está de férias.',
  },
  {
    icon: 'fish',
    title: 'Pesqueiro',
    text: 'Uma tarde à beira da água, esperando com calma, do jeito que a pescaria pede.',
  },
  {
    icon: 'heart',
    title: 'Fazendinha com animais',
    text: 'Ovelhas, cabrinhas e o pônei recebem as crianças para um encontro de perto.',
  },
  {
    icon: 'tent',
    title: 'Área de camping',
    text: 'Espaço amplo para montar a barraca em meio à natureza de Ubatuba.',
  },
  {
    icon: 'leaf',
    title: 'Áreas verdes e lago',
    text: 'Mata Atlântica por todos os lados, com o lago e o rio compondo a paisagem.',
  },
  {
    icon: 'wifi',
    title: 'Wi-Fi e ar-condicionado',
    text: 'Todas as suítes têm ar-condicionado, TV e Wi-Fi para o conforto da estadia.',
  },
  {
    icon: 'car',
    title: 'Estacionamento gratuito',
    text: 'Deixe o carro no Rancho e siga a pé para tudo o que há por aqui.',
  },
  {
    icon: 'clock',
    title: 'Recepção 24 horas',
    text: 'Chegou tarde? Tem sempre alguém para receber você na portaria.',
  },
  {
    icon: 'dice',
    title: 'Sala de jogos',
    text: 'Um espaço coberto para as tardes de chuva e as noites em família.',
  },
  {
    icon: 'bike',
    title: 'Aluguel de bicicletas',
    text: 'Uma forma leve de conhecer o entorno e chegar até a cachoeira.',
  },
];

/** Pontos de interesse próximos. Sustenta as buscas por "pousada perto de". */
export const nearby = [
  {
    icon: 'water',
    name: 'Cachoeira do Pé da Serra',
    distance: '2 km',
    text: 'Águas claras cercadas pela Mata Atlântica, a uma distância que dá até para fazer a pé em uma boa caminhada.',
  },
  {
    icon: 'pin',
    name: 'Entrada de Ubatuba',
    distance: 'Na Rodovia Oswaldo Cruz',
    text: 'Quem chega pela serra passa por aqui primeiro: menos tempo de estrada depois de uma viagem longa.',
  },
  {
    icon: 'sun',
    name: 'Praias de Ubatuba',
    distance: 'Litoral Norte',
    text: 'Mais de cem praias para incluir no roteiro, do movimento do centro às enseadas mais tranquilas.',
  },
  {
    icon: 'leaf',
    name: 'Serra do Mar e Horto Florestal',
    distance: 'No entorno',
    text: 'Trilhas, mirantes e um dos trechos mais preservados da Mata Atlântica do litoral paulista.',
  },
];

/** Moradores da fazendinha, apresentados em primeira pessoa como no site original. */
export const animals = [
  {
    image: 'ovelha',
    /** Enquadramento do recorte, já que cada foto tem o bicho em um canto. */
    position: 'center 32%',
    name: 'Vitória',
    kind: 'Ovelha',
    quote:
      'Sou mimada e faço um escândalo danado quando chega a hora de mamar.',
  },
  {
    image: 'cabrinha',
    position: 'center 42%',
    name: 'Lívia',
    kind: 'Cabrinha',
    quote: 'Curiosa desde pequena, sou sempre a primeira a chegar nas visitas.',
  },
  {
    image: 'ponei',
    position: '62% 62%',
    name: 'João Floquinho',
    kind: 'Pônei',
    quote: 'O mais fotografado da fazendinha, e eu sei muito bem disso.',
  },
  {
    image: 'cabra',
    position: '38% 45%',
    name: 'Dona Jô',
    kind: 'Cabra',
    quote: 'Sou mansinha e vou com quem me der alimento.',
  },
];

/**
 * Avaliações reais de hóspedes, transcritas dos cartões e prints publicados
 * pelo próprio Rancho (imagens 29, 30, 183 e 184 do acervo original).
 * Corrigimos apenas pontuação e acentuação; o conteúdo é o que cada pessoa
 * escreveu. Nada aqui é marcado como Review no schema: avaliação publicada
 * pelo próprio negócio no próprio site não gera rich result no Google.
 */
export const testimonials = [
  {
    name: 'Adriano Inácio',
    rating: 5,
    context: 'Hospedagem em agosto',
    text: 'Lugar super lindo, maravilhoso, com os animais bem próximos da gente, um ambiente muito bom de estar. E sem falar dos funcionários, todos muito educados. É preciso falar da comida: tudo uma delícia, sem falar da costela de fogo de chão, maravilhosa. Fui muito bem recebido já na entrada, levado até o quarto.',
    scores: 'Quartos 5/5 · Serviço 5/5 · Local 5/5',
    highlights: [],
  },
  {
    name: 'Marineide Sousa',
    rating: 5,
    context: 'Férias · Casal',
    text: 'Lugar maravilhoso, muito conforto, privacidade, ótima comida, café da manhã perfeito. Tudo que você precisa para ter um descanso maravilhoso, e muitas opções de entretenimento, a paz que você precisa, e perto de várias praias e da cidade de Ubatuba.',
    scores: 'Quartos 5/5 · Serviço 5/5 · Local 5/5',
    highlights: [],
  },
  {
    name: 'Tatiane Martins',
    rating: 5,
    context: 'Uma noite de presente',
    text: 'Gratidão total por tudo! Fui presenteada com uma noite de presente e foi o melhor presente! Desde a recepção na hora da chegada até a hora de vir embora. Café da manhã tudo fresquinho e organizado. E que mesa de café, muito top! Deus abençoe vocês. Até breve!',
    scores: 'Quartos 5/5 · Serviço 5/5 · Local 5/5',
    highlights: [],
  },
  {
    name: 'Nicolas Wolf',
    rating: 5,
    context: 'Férias · Família',
    text: 'Meu check-point em Ubatuba. Lugar maravilhoso, comida excelente, perfeito para as férias com amigos e família. Indico para qualquer um que pense em ir para Ubatuba.',
    scores: 'Quartos 5/5 · Serviço 5/5 · Local 5/5',
    highlights: ['Vista linda', 'Tranquilo', 'Bom preço'],
  },
  {
    name: 'André Guerino Lara',
    rating: 5,
    context: 'Férias · Família',
    text: 'Comida boa, música ao vivo e pescaria, tudo livre! Sensacional!',
    scores: '',
    highlights: ['Tranquilo', 'Ideal para crianças', 'Bom preço'],
  },
  {
    name: 'Priscila Kelly',
    rating: 5,
    context: 'Voltaremos mais vezes',
    text: 'Lugar de paz e sossego, adorei! Voltaremos mais vezes. Sem falar da comida, que é muito saborosa e farta, com um preço muito acessível.',
    scores: '',
    highlights: [],
  },
  {
    name: 'Hóspede do Rancho Texas',
    rating: 5,
    context: 'Depoimento publicado pelo Rancho',
    text: 'Lugar incrível para quem quer descansar de verdade e viver momentos especiais em família! O Rancho Texas Ubatuba surpreendeu pela natureza linda, ambiente tranquilo, piscina maravilhosa e a fazendinha que encantou as crianças. Atendimento acolhedor, comida deliciosa e suítes confortáveis. Um lugar onde a gente chega querendo descansar e vai embora querendo voltar. Super recomendo!',
    scores: '',
    highlights: [],
  },
];

export const rooms = [
  {
    name: 'Suíte Duplex',
    slug: 'suite-duplex',
    meta: 'Suíte Duplex de 66 m² no Rancho Texas Ubatuba: dois andares, vista para o parque ou o lago, ar-condicionado, TV e Wi-Fi. Consulte disponibilidade.',
    image: 'suite-duplex',
    size: '66 m²',
    tag: 'Espaço para estar junto',
    text: 'Dois andares, vista para o parque ou para o lago e espaço de sobra para a família aproveitar a estadia com tranquilidade.',
    amenities: [
      'Ar-condicionado',
      'TV LCD',
      'Wi-Fi',
      'Dois andares',
      'Vista para o parque ou para o lago',
    ],
  },
  {
    name: 'Suíte Eco Bloco',
    slug: 'suite-eco-bloco',
    meta: 'Suíte Eco Bloco de 20 m² no Rancho Texas Ubatuba, com cama de casal, beliche, ar-condicionado, TV e Wi-Fi, cercada pelo verde. Veja as datas livres.',
    image: 'suite-eco',
    size: '20 m²',
    tag: 'Simples e acolhedora',
    text: 'Uma opção prática com cama de casal e beliche, em um ambiente cercado pelo verde do Rancho.',
    amenities: [
      'Ar-condicionado',
      'TV LCD',
      'Wi-Fi',
      'Cama de casal e 1 beliche',
    ],
  },
  {
    name: 'Suíte Standard',
    slug: 'suite-standard',
    meta: 'Suíte Standard de 18 a 20 m² no Rancho Texas Ubatuba, em quatro configurações, com ar-condicionado, TV e Wi-Fi. Consulte valores para suas datas.',
    image: 'suite-standard',
    size: '18 a 20 m²',
    tag: 'Conforto na medida',
    text: 'Quatro configurações para escolher conforme a sua viagem: com janela para a piscina, com janela para o corredor, sem janela ou no formato casal.',
    amenities: [
      'Ar-condicionado',
      'TV LCD',
      'Wi-Fi',
      'Cama de casal, com ou sem beliche',
    ],
    variants: [
      {
        name: 'Standard com janela para a piscina',
        size: '20 m²',
        beds: 'Cama de casal e 1 beliche',
      },
      {
        name: 'Standard com janela para o corredor',
        size: '20 m²',
        beds: 'Cama de casal e 1 beliche',
      },
      {
        name: 'Standard sem janela',
        size: '18 m²',
        beds: 'Cama de casal e 1 beliche',
      },
      {
        name: 'Standard casal',
        size: '18 m²',
        beds: 'Cama de casal',
      },
    ],
  },
  {
    name: 'Suíte da Roça',
    slug: 'suite-da-roca',
    meta: 'Suíte da Roça de 25 m² no Rancho Texas Ubatuba: térrea, próxima ao rio, com clima rural, ar-condicionado, TV LED e Wi-Fi. Veja a disponibilidade.',
    image: 'suite-roca',
    size: '25 m²',
    tag: 'O charme da vida no campo',
    text: 'Com clima rural e aconchegante, é ideal para quem busca descanso e conexão com a natureza. Acomodação térrea próxima ao rio, com conforto, privacidade e fácil acesso à estrutura da pousada.',
    amenities: [
      'Ar-condicionado',
      'TV LED',
      'Wi-Fi',
      'Térrea, próxima ao rio',
      'Para casais e famílias',
    ],
  },
  {
    name: 'Suíte Casa Rosa',
    slug: 'suite-casa-rosa',
    meta: 'Suíte Casa Rosa de 80 m² no Rancho Texas Ubatuba, com varanda, frigobar, cama de casal, ar-condicionado, TV e Wi-Fi. Consulte as datas livres.',
    image: 'suite-casa-rosa',
    size: '80 m²',
    tag: 'Uma estadia descomplicada',
    text: 'Uma opção simples e funcional, ideal para quem busca uma hospedagem tranquila e prática. Equipada com cama de casal e varanda para aproveitar o fim de tarde.',
    amenities: [
      'Ar-condicionado',
      'TV LCD',
      'Wi-Fi',
      'Varanda',
      'Frigobar',
      'Cama de casal',
    ],
  },
];

export const faqs = [
  {
    question: 'Onde fica o Rancho Texas Ubatuba?',
    answer:
      'Estamos na Rodovia Oswaldo Cruz, km 88,9, nº 5228, no Horto Florestal, em Ubatuba, litoral norte de São Paulo. É logo na entrada da cidade para quem chega pela serra. Acesse a página Como chegar para abrir a rota no mapa.',
  },
  {
    question: 'O café da manhã está incluso?',
    answer:
      'Sim. O café da manhã está incluso na hospedagem e é servido das 7h às 9h, com frutas, bolos, pães de queijo e café fresco. O camping também tem a opção com café da manhã. O Rancho ainda conta com restaurante, que serve pratos típicos durante a estadia.',
  },
  {
    question: 'Qual a distância da Cachoeira do Pé da Serra?',
    answer:
      'A Cachoeira do Pé da Serra fica a cerca de 2 km do Rancho, na mesma região da Rodovia Oswaldo Cruz. É um passeio rápido e dá até para ir a pé em uma boa caminhada. A dica da casa é ir pela manhã ou depois das 16h, para evitar os horários de pico.',
  },
  {
    question: 'Como consultar valores e fazer uma reserva?',
    answer:
      'Escolha as datas e o número de hóspedes na busca de disponibilidade. Você será direcionado ao nosso motor de reservas Omnibees, onde poderá conferir tarifas, acomodações disponíveis e as condições da estadia.',
  },
  {
    question: 'Quais acomodações existem na pousada?',
    answer:
      'São cinco categorias: Suíte Duplex (66 m², dois andares), Suíte Eco Bloco (20 m²), Suíte Standard (18 a 20 m², em quatro configurações), Suíte da Roça (25 m², térrea e próxima ao rio) e Suíte Casa Rosa (80 m², com varanda e frigobar). Todas têm ar-condicionado, TV e Wi-Fi.',
  },
  {
    question: 'O Rancho tem atividades para crianças?',
    answer:
      'A fazendinha, a piscina, o parquinho e os espaços ao ar livre fazem parte da experiência no Rancho. Consulte nossa equipe sobre os horários e as condições das atividades durante sua estadia. Crianças devem estar acompanhadas de um responsável.',
  },
  {
    question: 'Posso acampar no Rancho?',
    answer:
      'Sim. O Rancho tem ampla área para campistas, com infraestrutura e acesso ao lazer da pousada. Basta uma barraca, um kit básico de acampamento e vontade de estar perto da natureza. Fale com nossa equipe para confirmar disponibilidade e valores para as suas datas.',
  },
  {
    question: 'Qual o horário de check-in e check-out?',
    answer:
      'O check-in é a partir das 14h e o check-out até as 12h. A recepção funciona 24 horas, então não há problema se a sua chegada for à noite. O estacionamento é gratuito para os hóspedes.',
  },
  {
    question: 'Como confirmar refeições, pets e condições da tarifa?',
    answer:
      'As condições podem variar conforme a acomodação e a tarifa escolhidas. Antes de reservar, confira os detalhes no motor de reservas ou fale com a equipe pelo WhatsApp para confirmar refeições, política de animais e as demais condições da sua estadia.',
  },
];
