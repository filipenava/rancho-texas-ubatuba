# Rancho Texas Ubatuba

Novo site estático em Astro, com 31 páginas geradas, 199 fotografias reais da pousada e consulta de disponibilidade no motor público da Omnibees. O site de produção não foi alterado.

## Executar

Recomendado: Node.js 22.19 ou superior. O projeto inclui um runtime Node 22 local para compatibilidade com o ambiente atual.

```sh
npm install
npm run dev
```

Abra http://127.0.0.1:4321. Para produção:

```sh
npm run check
npm test
npm run build
npm run preview
```

Os arquivos para hospedagem estão em `dist/`. `npm run test:e2e` executa os testes de navegação e acessibilidade com o site iniciado na porta 4321. Instale o navegador com `npx playwright install chromium` na primeira execução.

## Identidade e fotografias

- `research/originals/`: 210 imagens baixadas do site original, incluindo o logo transparente. Três referências estavam indisponíveis na coleta e estão registradas no inventário.
- `research/assets.json`: origem, dimensões e páginas associadas de cada imagem.
- `research/inventory.json`: inventário de páginas, cores e links de reserva do site original.
- `research/palette.json`: marrom, terracota e dourado extraídos do CSS original; cores de apoio do novo design identificadas separadamente.
- `research/selected-images.json`: origem das fotografias selecionadas.
- `public/images/`: logo original, favicon de 96 px e 28 fotografias selecionadas em WebP responsivo. Os originais ficam fora da publicação.
- O favicon é gerado à parte porque `logo.png` tem 500 px e 180 KB; servido como ícone, era o maior recurso da página inicial.
- `scripts/collect-assets.py`, `download-assets.py` e `prepare-images.py`: coleta e preparação reproduzíveis; dependem de Python, requests, beautifulsoup4 e Pillow.

## Conteúdo

Edite contatos, telefones, comodidades, pontos próximos, animais, depoimento, suítes e perguntas em `src/data/site.ts`; experiências em `src/data/experiences.ts`; os quatro artigos em `src/data/articles.ts`. Não foram inventados preços, avaliações, descontos, disponibilidade nem serviços incluídos em todas as tarifas. O blog contém conteúdo novo, não uma cópia dos artigos antigos.

## Acervo fotográfico

Todas as fotografias do site antigo estão no novo. `scripts/prepare-albums.py` percorre as 210 imagens baixadas e distribui **199 fotografias em 8 álbuns** — acomodações (74), natureza (36), aves (28), camping (17), fazendinha (16), casamentos (11), gastronomia (9) e piscina e lazer (8). Ficam de fora apenas os arquivos que não são fotografia: logos, o selo da Omnibees, os cartões e prints de avaliação e o mapa turístico da cidade. Três referências (ids 31, 45 e 134) já não respondiam na coleta original e estão registradas no inventário.

Os álbuns vivem em `/galeria/<slug>` e são gerados a partir de `src/data/albums.json`, que o script reescreve. Cada foto sai em duas larguras (560 px para a grade, 1600 px para o lightbox). As 29 imagens usadas dentro das páginas continuam em `prepare-images.py`, com quatro larguras e srcset. Para trocar a capa de um álbum, edite `covers` em `src/data/albums.ts`.

Nem toda foto do acervo tem a mesma qualidade: há fotografias de 640×480, imagens com marca-d'água antiga e ângulos repetidos, principalmente entre as de quartos. Elas entraram nos álbuns porque o acervo devia vir inteiro, mas as páginas principais usam só as selecionadas. Vale substituir as mais fracas quando houver fotos novas.

## Avaliações

`testimonials`, em `src/data/site.ts`, traz **sete avaliações reais**, transcritas dos cartões e prints que o próprio Rancho publicou (imagens 29, 30, 183 e 184 do acervo). Seis são assinadas; a sétima é a que o site antigo exibia sem autoria e está marcada como tal. Corrigimos apenas pontuação e acentuação.

Elas **não** são marcadas como `Review` no schema: avaliação publicada pelo próprio negócio no próprio site não gera rich result no Google e a marcação seria autopromocional. Quando a pousada quiser estrelas na busca, o caminho é o perfil do Google Business.

O botão "Deixe sua avaliação" aponta para a ficha do Google via busca, porque não há `place_id` público. Com o `place_id` em mãos, troque `site.review` por `https://search.google.com/local/writereview?placeid=<id>`, que abre a caixa de avaliação direto.

## Mapa

A página Como chegar embute um mapa do **OpenStreetMap**, não do Google: não exige chave de API, não deixa cookies de rastreio e carrega com `loading="lazy"`, então Como chegar mantém 97 de desempenho. O botão de rota continua abrindo o Google Maps, que é o que a maioria usa para navegar. A política de privacidade descreve esse carregamento. Se preferir o mapa do Google embutido, será preciso uma chave da Maps Embed API e uma revisão da política, porque o embed do Google deixa cookies.

## Auditoria de setembro de 2026

Uma auditoria completa de design, informação e SEO mediu as 31 páginas geradas, rodou Lighthouse em 13 páginas-tipo e testou tipografia, alvos de toque e navegação por teclado em viewport de 390 px. O que ela encontrou já está corrigido:

**Bugs**

- Trilha de navegação duplicada em ~20 páginas: `PageHero` tinha uma trilha própria e o `Layout` passou a renderizar outra. Ficou só a do `Layout`, que alimenta o `BreadcrumbList` e trata níveis aninhados.
- O botão flutuante do WhatsApp cobria "Ver disponibilidade" no celular. Agora um `IntersectionObserver` o esconde enquanto a busca de datas está na tela.
- O telefone da barra superior estava com `display: none` no mobile, justamente onde tocar num número é mais útil. Agora aparece a 12 px e some o texto decorativo de localização.
- `PageHero` usava o H1 como `alt` da foto de fundo. Passou a receber `imageAlt`, obrigatório, descrevendo a imagem.
- O lightbox ia para o HTML com `src=""`, o que dispara requisição para a própria página em alguns navegadores.

**Tipografia**

Havia 67 declarações de `font-size` abaixo de 12 px, e os breakpoints de mobile _reduziam_ ainda mais — chegava a 6 px. O Lighthouse reprovava a galeria com "34% de texto legível". Aplicamos um piso de 12 px para texto de leitura; rótulos em caixa alta com tracking ficam em 11 a 11,5 px e só os dois selos circulares, que têm espaço físico limitado, ficam em 8,5 px. A auditoria de fontes passa em todas as páginas.

**Imagens**

O `sizes` padrão do `Photo` declarava `50vw` em grades de três colunas, então o navegador baixava 800 px para exibir em 411 px. Cada grade agora declara a própria largura, e o pipeline gera duas larguras menores: 400 px nas imagens de página e 320 px nas de álbum. A galeria caiu de 1283 KB para 743 KB.

**SEO**

Todas as 31 páginas ficaram com título de até 62 caracteres e descrição entre 110 e 165. Cinco descrições de suíte chegavam a 274 caracteres porque saíam do texto longo do quarto — agora cada suíte tem um campo `meta` próprio. O schema `Hotel` usa uma descrição institucional fixa em vez de repetir a descrição de cada página sob o mesmo `@id`. Os artigos ganharam `datePublished`, `dateModified`, data e assinatura visíveis. As páginas de álbum ganharam dois parágrafos de texto, `og:image` própria e textos alternativos descritivos por álbum.

**O que ficou pendente e depende da pousada**

- **Preço.** Não há nenhuma indicação de valor no site. É a primeira pergunta de quem pesquisa, e três hóspedes citam "bom preço" nas avaliações. Publicar uma faixa ("a partir de") exige decisão comercial.
- **Política de animais.** Agregadores dizem que a pousada aceita animais pequenos; o site não fala. O campo `petsAllowed` foi removido do schema por não ser verificável.
- **Texto alternativo por foto.** Os 199 alts dos álbuns descrevem o assunto do álbum, não cada imagem. Uma passada humana melhoraria a busca por imagem.

## Dados da pousada e fontes

Contatos, comodidades e horários foram conferidos contra três fontes, nesta ordem de precedência:

1. **Rodapé e barra superior do site original** — os quatro telefones ((12) 3042-3177, (12) 3042-3171, WhatsApp (12) 99774-0679 e (12) 99680-0679), o endereço com CEP 11680-000 e os perfis de Instagram, Facebook e YouTube.
2. **Motor de reservas Omnibees** (página pública do hotel 10889) — check-in a partir das 14h, check-out até as 12h, recepção 24 horas, estacionamento gratuito, sala de jogos, aluguel de bicicletas, bar e restaurante.
3. **Artigos do próprio Rancho** — café da manhã incluso, restaurante com pratos típicos, pesqueiro e a Cachoeira do Pé da Serra a 2 km.

Pontos que exigem atenção antes do lançamento:

- **E-mail.** O site original mostra `reservas@ranchotexasubatuba.com.br` na barra superior e `c.reserva@hotmail.com` no rodapé. O novo site usa apenas o primeiro. Se o Hotmail ainda for a caixa que a equipe lê, redirecione ou ajuste `site.email`.
- **Endereço.** O site publica "Horto Florestal, 11680-000"; a Omnibees registra "Figueira (Pé da Serra), 11694-030". O novo site segue o que a pousada publica. Vale alinhar as duas fichas.
- **Distância da cachoeira.** O artigo do Rancho diz 2 km; agregadores de reserva dizem 1 km. Mantivemos os 2 km, que é a informação publicada pela própria pousada.
- **Coordenadas.** `site.geo` usa -23.40571, -45.11796 e alimenta o `geo` do schema. Confirme no mapa antes de publicar.
- **Preços.** As promoções do site antigo (30% de baixa temporada, camping 5x R$42, Réveillon 5x R$65, cupom de 10%) não foram replicadas: valores promocionais envelhecem e viram informação errada na busca. Tarifas ficam a cargo do motor de reservas.

## Omnibees

Integração por redirecionamento ao motor existente, sem acesso à API privada:

- Endpoint: `https://book.omnibees.com/hotelresults`.
- Cliente `c=6369`, hotel `q=10889`, idioma `pt-BR`, moeda `currencyId=16`.
- Datas em `DDMMYYYY`, `NRooms=1`, adultos `ad`, quantidade de crianças `ch`, idades `ag` separadas por **ponto e vírgula**, cupom opcional `Code`.
- O formulário exige as idades, impede datas passadas e saída anterior à chegada. A pesquisa contempla uma acomodação; grupos são direcionados ao atendimento.
- Identidade da pousada e parâmetros foram conferidos em resposta HTTP 200 do motor real; recebimento de datas e `ag=0;8` confirmado nos campos do HTML. A lista de idades do motor oferece de 0 a 17 anos.
- Os testes automatizados do navegador interceptam a saída para conferir o link. Nenhuma reserva ou pagamento foi realizado. Preços, disponibilidade, confirmação e pagamento são responsabilidade do motor Omnibees.
- Integração privada de inventário/API, caso desejada futuramente, requer credenciais e contrato com a Omnibees; não é necessária para este fluxo.

## SEO e publicação

HTML estático, idioma pt-BR, título e descrição específicos por página, uma H1 por página, URLs canônicas, Open Graph, dados estruturados Hotel/BlogPosting, sitemap e robots.txt. Imagens responsivas em WebP, carregamento tardio fora do destaque e fontes locais.

`public/_redirects` contém redirecionamentos permanentes para as páginas antigas, incluindo os endereços descobertos no sitemap. Esses arquivos são reconhecidos em hospedagens compatíveis, como Netlify; em outro servidor, importe as mesmas regras para a configuração do provedor. O domínio canônico está em `astro.config.mjs` e `src/data/site.ts`.

Para lançar: revisar informações comerciais com a pousada, publicar `dist/` no provedor escolhido, aplicar os redirecionamentos, validar domínio/HTTPS e enviar `sitemap-index.xml` ao Google Search Console. A configuração de preview deve permanecer fora do índice. Rankings e indexação dependem do Google; o projeto entrega a base técnica, não uma garantia de posição.

O arquivo `netlify.toml` configura o build e `PUBLIC_NOINDEX=true` nos previews e branches, ativando meta robots noindex. Para previews em outros provedores, use essa variável de ambiente ou aplique `X-Robots-Tag: noindex`. Não há analytics, pixels de publicidade nem cookies de marketing nesta implementação. Se esses serviços forem adicionados, a documentação de privacidade e a gestão de consentimento precisam refletir a configuração publicada.

## Validação

- Testes unitários: datas, virada de ano, idades, codificação de cupom e parâmetros Omnibees.
- Playwright: reserva, validação, menu móvel, filtros da galeria, lightbox, SEO e acessibilidade WCAG A/AA nas páginas principais.
- `scripts/visual-review.mjs`: imagens, links internos e capturas desktop/mobile.
- `research/`: capturas e relatórios locais da verificação.

Auditoria Lighthouse da página inicial em build de produção, com simulação móvel local (16/09/2026): **92 desempenho, 100 acessibilidade, 100 boas práticas e 100 SEO** na página inicial; 98 em Avaliações, 97 em Como chegar e 89 a 90 na galeria e nos álbuns. LCP 3,3 s; CLS 0; bloqueio de thread principal 0 ms. O relatório completo está em `research/lighthouse.json`. São medidas de laboratório, sujeitas à hospedagem, rede e dispositivo; não medem posições no Google.

Fontes de referência: [site original](https://www.ranchotexasubatuba.com.br/), [motor de reservas](https://book.omnibees.com/hotelresults?c=6369&q=10889), [orientações de migração do Google](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
