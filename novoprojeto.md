# Novo Projeto — Landing Page a partir de fotos

Este documento serve para **iniciar uma nova sessão** e construir uma landing page
estática de altíssima qualidade, com a **identidade visual derivada das fotos** que
forem colocadas no diretório do projeto.

Ele tem três partes:

0. **[O BRIEFING DO CLIENTE](#0-briefing-do-cliente-preencher-a-cada-projeto)** — a única
   parte que você edita a cada projeto novo.
1. **[O PROMPT](#1-o-prompt-copiar-e-colar)** — cole em uma nova sessão do Claude Code.
2. **[A ESPECIFICAÇÃO](#2-especificação-técnica-a-referência-de-qualidade)** — a referência
   de qualidade que o prompt manda seguir. Não precisa ler para usar; serve de contrato.

---

## 0. BRIEFING DO CLIENTE (preencher a cada projeto)

> **Esta é a única seção que muda de projeto para projeto.** Apague o conteúdo de exemplo
> e preencha com os dados do cliente novo. O que você não souber, deixe em branco — o
> prompt manda perguntar antes de codar e usar `TODO` no lugar do que ficar sem resposta.

```
NEGÓCIO
  Nome:
  O que é:
  Cidade/UF:
  Posicionamento:
  Público:

CONTATO
  WhatsApp:
  E-mail:
  Instagram:
  Outras redes:

FOTOS
  Diretório:           fotos/   (padrão — só mude se houver um bom motivo)
  Observação:

DOMÍNIO
  Definitivo:
  Provisório:

CONTEÚDO ESPECÍFICO
  (produtos, marcas parceiras, cardápio, planos, unidades… o que a página precisa listar)

RODAPÉ
  Crédito: Desenvolvido por protalksystem.com
```

### Modelo em branco (copie para um projeto novo)

```
NEGÓCIO
  Nome:
  O que é:
  Cidade/UF:
  Posicionamento:
  Público:

CONTATO
  WhatsApp:
  E-mail:
  Instagram:
  Outras redes:

FOTOS
  Diretório:           fotos/   (padrão — só mude se houver um bom motivo)
  Observação:

DOMÍNIO
  Definitivo:
  Provisório:

CONTEÚDO ESPECÍFICO
  (produtos, marcas parceiras, cardápio, planos, unidades… o que a página precisa listar)

RODAPÉ
  Crédito: Desenvolvido por protalksystem.com
```

---

## 1. O PROMPT (copiar e colar)

> Cole o bloco abaixo em uma **nova sessão**, dentro da pasta do novo projeto, **depois**
> de já ter colocado as fotos do cliente em `fotos/` e este arquivo
> `novoprojeto.md` na raiz.

```
Você vai construir uma landing page estática de altíssima qualidade seguindo À RISCA
a especificação em `novoprojeto.md` (seção 2). Antes de escrever qualquer código:

1. Leia `novoprojeto.md` inteiro, começando pelo BRIEFING DO CLIENTE (seção 0) —
   é de lá que saem nome, cidade, contatos, domínio e o conteúdo específico da página.
2. Olhe TODAS as imagens que estão em `fotos/` (use o tool de leitura de imagem em
   CADA uma). A partir delas, extraia a IDENTIDADE VISUAL do lugar/produto:
   - Paleta: 4–6 cores dominantes reais das fotos (fundo, texto, 1 cor "de marca"
     quente/fria, 1–2 de apoio). Gere tokens claros E escuros a partir delas.
   - Materiais e clima (ex.: madeira/pedra/concreto/vegetação/mar/urbano/minimal) →
     isso define bordas, sombras, texturas e o "peso" do design.
   - Par tipográfico coerente com o clima (1 display + 1 texto), self-hosted em woff2.
   - SE as fotos não derem uma paleta de marca utilizável (ex.: só retratos em fundo
     neutro, ou logos de terceiros com cores que não são do cliente), NÃO force:
     me diga isso e proponha uma base neutra + 1 accent, justificando. Paleta ruim
     tirada "à força" das fotos é pior que uma neutra bem resolvida.
3. Faça-me estas perguntas ANTES de codar — só o que faltar no briefing e não der para
   inferir das fotos. Se eu não responder, use placeholders bem marcados com TODO.
4. Só então gere os arquivos EXATAMENTE na estrutura e no padrão de qualidade da seção 2:
   index.html + styles/main.css + lib/main.js + SEO (meta/OG/Twitter/JSON-LD/sitemap/
   robots/manifest/llms.txt) + Dockerfile + nginx.conf. Otimize as fotos para WebP com
   srcset (400/800/1600) e gere favicons/og-image.
5. No fim, rode o CHECKLIST DE ACEITE (seção 2.8) item a item e me diga o resultado.
   MEÇA em vez de afirmar de memória: contraste com cálculo, assets com requisição real.

REGRAS INEGOCIÁVEIS (herdadas do projeto de referência):
- Sem framework, sem build, sem dependência de runtime. HTML + CSS moderno + JS ES vanilla.
- Design system por tokens CSS em :root, com tema claro e escuro (dark como padrão,
  toggle persistido em localStorage, sem flash de tema).
- Acessibilidade WCAG AA e prefers-reduced-motion respeitado. Lighthouse ~100.
- Português do Brasil, tom acolhedor e concreto (nada genérico de marketing).
- Todas as cores, fontes e o "mood" DEVEM sair das fotos — não copie a paleta âmbar/mata
  da Casa do Chapéu. A ESTRUTURA e o NÍVEL de acabamento se copiam; a APARÊNCIA, não.

Trabalhe em etapas, me mostrando a paleta e o par tipográfico extraídos das fotos ANTES
de escrever o CSS, para eu aprovar.
```

---

## 2. Especificação técnica (a referência de qualidade)

O que segue descreve **o que torna a landing page de referência boa**. A nova página deve
igualar cada item — mudando apenas a identidade visual (cores, fontes, materiais, textos e
fotos), que sai das imagens anexadas.

### 2.1 Stack e princípios

- **HTML5 + CSS moderno + JavaScript ES vanilla. Zero build, zero dependência de runtime.**
  A escolha por site estático é deliberada: carregamento instantâneo, Lighthouse ~100.
- Fontes **self-hosted** em `woff2` (variável, subset latin) — nunca Google Fonts via CDN.
- Imagens em **WebP** com `srcset` responsivo (larguras ~400/800/1600), `loading="lazy"`
  em tudo menos no hero, e **preload apenas do hero** com `fetchpriority="high"`.
  No `sizes`, o valor de desktop leva teto absoluto derivado do `--container`
  (`min(46vw, 530px)`, não `46vw`) — sem ele o navegador superestima e baixa candidato
  maior que o necessário. Preload também da fonte usada acima da dobra, **incluindo a
  variante itálica** se houver `<em>` no `h1`.
- **Dark mode** automático (`prefers-color-scheme`) + toggle persistido em `localStorage`,
  aplicado por um script inline no `<head>` para **não haver flash de tema errado**.
- Interações nativas e leves: scroll reveal e parallax via `IntersectionObserver`, lightbox
  via `<dialog>` — **tudo respeitando `prefers-reduced-motion`**.
- **Acessibilidade WCAG AA**: navegação por teclado, ARIA, skip link, `alt` em toda imagem,
  `:focus-visible` visível, contraste suficiente em ambos os temas.
- **SEO completo**: meta description/keywords, Open Graph, Twitter Cards, `sitemap.xml` com
  extensão de imagens, `robots.txt`, JSON-LD (o `@type` certo para o negócio), `site.webmanifest`.

### 2.2 Estrutura de arquivos (replicar)

```
index.html            Página única (landing)
robots.txt            Diretivas para indexadores
sitemap.xml           Sitemap com extensão de imagens
site.webmanifest      Manifest PWA básico
llms.txt              Resumo do negócio para LLMs (auditado pelo PageSpeed — ver 2.7)
favicon.ico           Não esquecer no COPY do Dockerfile
Dockerfile            nginx não-root, porta 8080
nginx.conf            gzip, cache imutável, security headers, /healthz
.dockerignore         mantém fotos/ e docs fora da imagem
fotos/                ENTRADA: fotos originais do cliente (não vão para a imagem)
assets/
  images/             Fotos otimizadas em WebP (400/800/1600) + ícones/favicons
  fonts/              Par tipográfico (woff2 variável, subset latin)
  data/reviews.json   (se houver avaliações dinâmicas)
styles/
  main.css            Design system (tokens) + componentes + seções
lib/
  main.js             Interações (menu, tema, reveal, parallax, lightbox, etc.)
```

### 2.3 Design system — como derivar das fotos

O CSS de referência começa com um bloco de **tokens** em `:root` e um override em
`:root[data-theme='dark']`. Reproduza essa estrutura, mas **preencha os valores a partir
das fotos**:

- **Cores** — extraia 4–6 cores dominantes das imagens e mapeie para papéis semânticos:
  `--bg`, `--surface`, `--text`, `--text-soft`, `--heading`, `--border`, mais 1 cor de
  marca (`--accent`) e 1–2 de apoio. Defina o conjunto para tema claro e derive o escuro
  (fundos muito escuros, texto creme/claro, mesmo accent ajustado). Mantenha contraste AA.
- **Tipografia** — escolha **1 display + 1 texto** coerentes com o clima das fotos
  (ex.: serif elegante para rústico/aconchegante; grotesk para urbano/minimal; humanista
  para artesanal). Tokens `--font-display` e `--font-body`.
- **Forma e profundidade** — `--radius`, `--shadow`, `--shadow-lift` refletem o material:
  cantos mais duros e sombras secas para concreto/urbano; cantos macios e sombras quentes
  para madeira/tecido. Defina também `--container`, `--gutter`, `--section-y`, `--ease-out`.

Referência dos nomes de token usados no projeto original (para você espelhar a semântica,
**não os valores**): `--bg --surface --text --text-soft --heading --border --shadow
--shadow-lift --font-display --font-body --radius --radius-sm --container --gutter
--section-y --ease-out`, com override completo em `:root[data-theme='dark']`.

Inclua sempre: reset enxuto, `@media (prefers-reduced-motion: reduce)`, `.container`,
`.visually-hidden`, `.skip-link`, `:focus-visible`, e um par `.section-head`/`.eyebrow`
para os cabeçalhos de seção.

### 2.4 Seções da página (adaptar ao negócio)

A página de referência tem esta sequência. Mantenha o **esqueleto**; troque o conteúdo
pelo do novo negócio (nem toda seção é obrigatória — corte o que não fizer sentido):

1. **Header** fixo com logo, nav âncora, toggle de tema e menu hambúrguer no mobile;
   ganha sombra/fundo ao rolar (`.scrolled`).
2. **Hero** — imagem forte de fundo, título display, subtítulo, CTA primário (ex.: WhatsApp)
   e secundário. É a única imagem com preload.
3. **Sobre** — o que é o lugar/produto, em 1–2 parágrafos concretos + imagem.
4. **Ofertas/Produtos** (na referência: "Chalés") — 2+ cards com foto, nome, descrição,
   capacidade/atributos.
5. **Galeria** — grid de fotos com **lightbox** (`<dialog>`, teclado, setas, fechar no backdrop).
6. **Diferenciais/Estrutura** — grid de ícones + rótulos curtos (wifi, estacionamento, etc.).
7. **Experiência/Entorno** — imagem + texto sobre o contexto (natureza, bairro, vibe).
8. **Faixa parallax** com um depoimento ou frase de destaque.
9. **Localização** — texto + mapa/link.
10. **Avaliações** — nota agregada + cards (estáticos ou de `reviews.json`).
11. **FAQ** — `<details>`/acordeão acessível.
12. **CTA final** — bloco de conversão.
13. **Footer** — contato, redes, links, plataformas (Airbnb/Booking/iFood/etc. conforme o caso).

Todas as seções relevantes recebem a classe `.reveal` para entrada animada.

### 2.5 JavaScript (lib/main.js) — comportamentos a reproduzir

Vanilla, com `defer`, sem dependências. Reproduza (adaptando ao conteúdo):

- **Sem page loader.** Parece refinamento, mas é uma tela opaca cobrindo a página: os
  primeiros frames do filmstrip ficam em branco e o Speed Index piora. Num site estático
  que pinta em <1s não há espera para mascarar (ver erros conhecidos).
- **Header** que ganha `.scrolled` após ~40px de scroll (listener `passive`). Chame o
  handler inicial dentro de `requestAnimationFrame` — chamada direta na carga lê
  `scrollY` e mexe em classe na sequência, forçando reflow síncrono.
- **Menu mobile**: toggle com `aria-expanded`, fecha ao clicar num link e no `Esc`.
- **Tema**: alterna `data-theme` no `<html>` e persiste em `localStorage` (chave própria).
- **Scroll reveal** via `IntersectionObserver` para `.reveal`.
- **Parallax** leve em `[data-parallax]`, calculado no scroll, **desligado** se
  `prefers-reduced-motion`.
- **Lightbox** com `<dialog>`: abre no clique da galeria, navega com setas do teclado e
  botões, fecha no `Esc`, no botão e ao clicar no backdrop.
- Se houver avaliações: `fetch('assets/data/reviews.json')` e render de cards + estrelas
  em SVG, com fallback silencioso se falhar.

### 2.6 Deploy (replicar tal e qual)

- `Dockerfile` baseado em **`nginxinc/nginx-unprivileged:1.27-alpine`** (não-root),
  escutando na **porta 8080**, com `COPY --chown=nginx:nginx` dos arquivos e `HEALTHCHECK`
  em `/healthz` via `wget`.
- `nginx.conf`: gzip para HTML/CSS/JS/SVG, **cache imutável de 1 ano** para imagens/fontes,
  **security headers** (a CSP deve ficar em **uma única linha** no `add_header` — CSP
  multi-linha quebra o start do container), endpoint `/healthz`. **Não** colocar rate
  limiting no `nginx.conf` (quebra o start neste setup) e **não** rodar `apk add` (imagem
  non-root não instala pacote).
- **Confira o `COPY` arquivo por arquivo.** Se o Dockerfile lista os arquivos da raiz
  individualmente, é fácil esquecer um (`favicon.ico` é o clássico) — e o `try_files`
  faz o esquecido cair no `index.html`, devolvendo a página inteira com status 404 e
  `content-type` errado. Depois do deploy, teste **cada** arquivo da raiz com uma
  requisição real e confira status **e** content-type.
- `.dockerignore` mantendo fora da imagem as fotos-fonte originais, `README.md`,
  `novoprojeto.md` e `.git/`.
- Serve em qualquer host estático também (Netlify/Cloudflare Pages/GitHub Pages), sem build.
- Deploy alvo: VPS com **Dokploy + Traefik** (Application → Dockerfile → porta 8080 →
  domínio + Let's Encrypt → webhook de auto-deploy no push). O Traefik já entrega
  HTTP/2 e TLS — não há nada a configurar no projeto para isso.

### 2.7 Performance e SEO (metas verificadas, não estimadas)

Alvo: **100/100/100/100 no PageSpeed mobile** e **3/3 em navegação agêntica**. O projeto
Clau Representações bateu isso — o que segue é o que fez a diferença, medido.

Dois itens costumam sobrar no relatório e **devem sobrar**, por decisão consciente:
o CSS bloqueante (~200 ms) e o TTL curto de CSS/JS. As duas "correções" pedem um build
step — inline de CSS crítico duplicado à mão, ou hash no nome dos arquivos. Registre a
decisão no lugar de perseguir o número; a nota fecha em 98–100 mesmo assim, e o
PageSpeed varia entre execuções (a mesma página mediu 190, 250 e 280 ms sem mudança
nenhuma no código). Não persiga ruído de medição.

**Métricas alvo (Lighthouse mobile)**

| Métrica | Alvo | Como se consegue |
|---|---|---|
| FCP | < 1,8s | HTML pequeno, 1 só CSS, fontes com `preload` |
| LCP | < 2,5s | imagem do hero em WebP, `preload` + `fetchpriority="high"` |
| TBT | 0 ms | JS com `defer`, sem biblioteca, listeners `passive` |
| CLS | **0** | `width`/`height` em **toda** imagem + `aspect-ratio` nos contêineres |
| Cadeia crítica | < 150 KB | ver "orçamento" abaixo |

**Orçamento de peso da primeira dobra** (medir com requisição real, com gzip):
HTML ~8 KB · CSS ~6 KB · JS ~2 KB · fontes ~75 KB · imagem do hero ~35 KB → **~125 KB**.

**Compressão** — `gzip on` no nginx para HTML/CSS/JS/SVG/XML/JSON cobre o essencial:
HTML 32 KB → 7,6 KB, CSS 22 KB → 5,5 KB. **Não** adicione minificação: com gzip ligado
o ganho extra é de 1–3 KB e custaria um build step, o que contraria a regra de "zero build".
Ao testar com `curl`, mande `Accept-Encoding: gzip` — sem esse header o servidor responde
sem compressão e parece (falsamente) que o gzip está desligado.

**Cache por tipo de arquivo** — três políticas distintas, não uma só:

- imagens e fontes → `max-age=31536000, immutable` (1 ano; o nome do arquivo muda quando
  o conteúdo muda)
- CSS e JS → `max-age=3600, must-revalidate` (mudam a cada deploy)
- HTML → `no-store, must-revalidate` (garante que o deploy novo aparece na hora)

**Fontes: sempre fazer subset.** É o item mais pesado da primeira dobra. Baixe o woff2
latino e reduza ao conjunto realmente usado (ASCII + acentuados do pt-BR + pontuação
tipográfica). No projeto Clau: Fraunces 67 KB → 49 KB, Inter 48 KB → 27 KB (−39 KB no
total). Use `fonttools`; **valide depois** que nenhum caractere da página ficou de fora
e que os eixos variáveis sobreviveram.

**CDN** — só se o público for geograficamente espalhado. Para negócio local (uma cidade,
um estado) com servidor respondendo em ~0,2s, CDN adiciona custo e complexidade sem
ganho perceptível. Registre a decisão em vez de deixar como pendência vaga.

**SEO on-page** — além do que já está em 2.1: `lang="pt-BR"` no `<html>`, um único `<h1>`,
`canonical`, `alt` em toda imagem, âncoras que apontam para `id`s existentes, e nenhum
`id` duplicado.

**Domínio nos metadados** — canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD,
`sitemap.xml` e `robots.txt` devem apontar para um domínio **que existe e responde**.
Domínio placeholder quebra o card de preview no WhatsApp e no Instagram — justamente
onde a página mais circula. Se o definitivo ainda não existe, use o provisório real e
deixe o `TODO` dizendo o que trocar depois.

**`www`** — não configure por padrão. Em subdomínio não faz sentido nenhum. Em domínio
próprio, faça os dois responderem, com `www` dando **301** para a versão sem `www`
(servir nos dois divide o SEO).

**`llms.txt` — seguir a spec do llmstxt.org à risca.** O PageSpeed audita isso na
categoria "navegação agêntica". A regra que mais se erra: **toda seção `##` tem que ser
uma lista de links no formato `[nome](url)`**. Não vale URL solta entre parênteses nem
seção de texto corrido. A estrutura válida é:

```
# Nome do negócio

> Resumo em uma ou duas frases.

Texto livre de contexto (parágrafos, sem headings).

## Páginas
- [Título](https://url): descrição.

## Optional
- [O que um agente pode pular](https://url): descrição.
```

**Verificação obrigatória depois do deploy** — medir, não supor:

```bash
U=https://SEU-DOMINIO
# status + content-type de CADA arquivo da raiz
for p in / /robots.txt /sitemap.xml /site.webmanifest /llms.txt /favicon.ico /healthz; do
  curl -sS -o /dev/null -m 20 -w "$p  http=%{http_code} tipo=%{content_type}\n" $U$p
done
# gzip ativo?
curl -sSI -H 'Accept-Encoding: gzip' $U/ | grep -i content-encoding
# cache por tipo
curl -sSI $U/assets/fonts/*.woff2 | grep -i cache-control
# tempo de resposta
curl -sS -o /dev/null -w 'ttfb=%{time_starttransfer}s total=%{time_total}s\n' $U/
```

> **Cuidado com a ferramenta mentindo.** `curl -w '%{http_version}'` pode reportar `1.1`
> só porque o `curl` local foi compilado sem HTTP/2 — isso não diz nada sobre o servidor.
> Para saber de verdade, cheque o ALPN:
> `echo | openssl s_client -connect HOST:443 -servername HOST -alpn h2 | grep ALPN`.

### 2.8 Checklist de aceite (antes de considerar pronto)

**Identidade e conteúdo**

- [ ] Paleta, fontes e "mood" saíram **das fotos** (ou, se elas não davam paleta usável,
      a base neutra + accent foi proposta e aprovada explicitamente).
- [ ] Tema claro e escuro completos; dark como padrão; sem flash; toggle persistido.
- [ ] Contraste **calculado** (não estimado): todo par texto/fundo passa WCAG AA nos
      dois temas, incluindo texto sobre o accent.
- [ ] Textos concretos e em pt-BR; nenhum "lorem ipsum"; TODOs marcados onde faltou info.
- [ ] Nenhum número escrito à mão que envelhece sozinho (ex.: "6 marcas" fixo no HTML).

**Acessibilidade**

- [ ] `alt` em toda imagem; navegação 100% por teclado; `:focus-visible` visível.
- [ ] `prefers-reduced-motion` desliga parallax e animações.
- [ ] Um único `<h1>`; nenhum `id` duplicado; toda âncora aponta para um `id` existente.

**Performance (medida, não estimada)**

- [ ] Todas as imagens em WebP com `srcset`; só o hero com preload + `fetchpriority`.
- [ ] Todo `sizes` tem teto absoluto no valor de desktop (`min(Nvw, Npx)`).
- [ ] `width`/`height` em toda imagem **conferidos contra as dimensões reais do arquivo
      do `src`** (script, não olho) — largura/altura invertidas passam despercebidas.
- [ ] Nenhum arquivo de imagem grande usado como `<img>` em tamanho pequeno: `grep` do
      nome de cada asset trocado, porque o mesmo arquivo costuma estar em 2–3 lugares.
- [ ] Fontes com subset para o conjunto pt-BR; cobertura conferida contra o texto real.
- [ ] gzip confirmado com `Accept-Encoding: gzip` em HTML, CSS, JS e XML.
- [ ] Cache conferido por tipo (imagens/fontes 1 ano, CSS/JS 1h, HTML `no-store`).
- [ ] Cadeia crítica dentro do orçamento (~125 KB).

**SEO e indexação**

- [ ] meta, OG, Twitter, JSON-LD (tipo correto), sitemap com imagens, robots, manifest.
- [ ] Todos apontam para um domínio **que responde** — nunca placeholder inexistente.
- [ ] `llms.txt` validado contra a spec do llmstxt.org (seções `##` = listas de links).

**Deploy**

- [ ] `Dockerfile` + `nginx.conf` sobem o container non-root na 8080 com `/healthz` OK.
- [ ] **Cada** arquivo da raiz testado em produção com status **e** content-type corretos
      (o `favicon.ico` esquecido no `COPY` é o erro clássico).

**Prova final**

- [ ] PageSpeed **mobile** rodado de verdade: 100/100/100/100 e 3/3 em navegação agêntica.
      Se alguma categoria não fechou, dizer qual e por quê — não arredondar para cima.

---

### Notas para não repetir erros conhecidos

**Da Casa do Chapéu** — já nasça sem eles:

- **CSP em uma única linha** no `add_header` (multi-linha quebrava o nginx).
- **Sem rate limiting** no `nginx.conf` (quebrava o start do container).
- **Sem `apk add`** no Dockerfile — a imagem non-root não instala pacote; use as
  ferramentas que já existem (ex.: `wget` no healthcheck).
- **Tema escuro como padrão**, aplicado por script inline no `<head>` antes do CSS.

**Da Clau Representações** — erros cometidos e corrigidos neste projeto:

- **`favicon.ico` fora do `COPY`** do Dockerfile: dava 404 servindo o `index.html`
  inteiro (32 KB) com `content-type: text/html`. Teste cada arquivo da raiz depois
  do deploy.
- **`llms.txt` fora da spec**: seções de texto corrido e URLs soltas entre parênteses
  reprovavam a auditoria de navegação agêntica. Toda seção `##` é lista de links.
- **Domínio placeholder nos metadados**: `og:image` apontando para domínio inexistente
  fazia o link compartilhado no WhatsApp aparecer sem card de preview.
- **Accent bonito mas reprovado**: a primeira cor de marca escolhida dava 4,17:1 com
  texto branco. **Calcule o contraste antes** de fixar a paleta, não depois.
- **Afirmar sem medir**: em dois momentos uma conclusão foi tirada da saída de uma
  ferramenta sem checar o que ela realmente mede (o `curl` sem suporte a HTTP/2
  reportando `1.1`; um servidor estático antigo respondendo 404 de outro diretório).
  Quando a medição contrariar o esperado, **desconfie primeiro da ferramenta**.
- **Logos de terceiros nem sempre existem**: sites de marcas parceiras muitas vezes
  publicam o logo da plataforma de e-commerce, um ícone genérico ou nada. Confira o
  que baixou **olhando a imagem**; se não servir, wordmark tipográfico é melhor que
  logo errado.

**Da otimização da Casa do Chapéu** — rodada de PageSpeed que levou o mobile a 98:

- **`sizes` sem teto absoluto é o que faz o navegador baixar imagem maior que o
  necessário.** Um `sizes="(max-width: 56em) 92vw, 46vw"` promete 46% da viewport no
  desktop, mas se o `--container` tem 72rem a coluna nunca passa de ~530px. O navegador
  acredita na promessa e escolhe o candidato de 800px onde cabia o de 400px. Escreva
  `min(46vw, 530px)` — o teto vem do container, não do palpite. Foi isso que zerou o
  item "melhorar a entrega de imagens", **não** recompressão.
- **Não recomprima WebP já comprimido.** Testado e descartado: reencodar as fotos com
  qualidade menor rendeu −8% no total e **um arquivo cresceu 8%**. Se o PageSpeed
  reclamar de compressão, reprocesse a partir do original em `fotos/`; mexer no WebP
  de saída degrada sem ganhar tamanho.
- **O mesmo arquivo de imagem costuma estar em mais de um lugar.** O `favicon-192.png`
  (32 KB) era usado como `<img>` no page loader, no logo do header e no do rodapé.
  Corrigi só o loader, e o item voltou no relatório seguinte. Ao trocar um asset,
  faça `grep` do nome no HTML inteiro antes de dar por resolvido.
- **Page loader sabota o Speed Index.** Uma tela `position: fixed; inset: 0` opaca
  garante que os primeiros frames do filmstrip fiquem em branco — e o Speed Index mede
  exatamente quão rápido o conteúdo aparece. Numa página que pinta o FCP em 0,9s o
  loader não mascara espera nenhuma: esconde conteúdo pronto. Em site estático rápido,
  **não coloque loader**.
- **A fonte usada só em `<em>`/itálico precisa de preload também.** A `fraunces-italic`
  aparecia no `<em>` do `h1` do hero, mas sem preload só era descoberta depois do parse
  do CSS — virava o último elo de uma cadeia crítica de 2.106 ms. Se a fonte é usada
  acima da dobra, ela entra no preload, mesmo sendo "só" a variante itálica.
- **`width`/`height` descrevem o arquivo do `src`, não a foto original.** Uma imagem
  800×1067 declarada como `4080×3060` tinha largura e altura **invertidas**: o navegador
  reservava espaço deitado para foto em pé. Não apareceu no PageSpeed por ser `lazy`,
  mas era CLS real. Vale um script que compare os atributos com as dimensões reais.
- **`add_header` depois de `return` não se aplica.** O `location = /healthz` devolvia
  `application/octet-stream,text/plain` (dois content-types concatenados) porque o
  `return 200` encerra o processamento. Use `default_type` **antes** do `return`.
- **O nginx não conhece `.webmanifest`.** Sai como `application/octet-stream` e a
  auditoria de PWA ignora. Precisa de um `location = /site.webmanifest` com
  `types { } default_type "application/manifest+json; charset=utf-8";`.
- **Cache de CSS/JS: não ceda ao PageSpeed.** Ele pede TTL longo, mas sem hash no nome
  do arquivo isso serve CSS velho depois do deploy. Registre a decisão em vez de trocar
  4 KB por um bug visual. Mesma lógica para o CSS bloqueante: inline de CSS crítico
  cria duplicação manual num projeto sem build.
- **Ferramenta local mentindo, de novo.** No Windows, o `curl` do Git Bash converteu a
  URL em caminho (`C:/Program Files/Git/robots.txt`) e o `Invoke-WebRequest` do
  PowerShell 5.1 falhou o TLS por não negociar 1.2 por padrão. Nenhum dos dois dizia
  nada sobre o servidor. Confirme o handshake com `SslStream` antes de concluir que o
  site está fora do ar.
- **O ambiente muda durante a sessão.** Um diagnóstico de certificado inválido no `www`
  estava correto quando medido (`CN=TRAEFIK DEFAULT CERT`) e ficou obsoleto meia hora
  depois, quando o Let's Encrypt emitiu. **Remeça antes de agir** sobre um achado de
  infraestrutura que ficou parado na conversa.

**Sobre conteúdo local (SEO de negócio de bairro/cidade):**

- **Geo-tags e meta keywords não priorizam cidade de origem.** `geo.region` e `ICBM` são
  praticamente ignorados, e `keywords` morreu em 2009. O que traz hóspede de outra cidade
  é (1) Google Business Profile e (2) conteúdo que responde a busca real de quem vem de
  fora: tempo de viagem, condição da estrada, o que tem no caminho.
- **Número que envelhece sozinho: use faixa, não valor único.** "Cerca de 4h20" virou
  "entre 4h e 4h30" depois que o dono disse que já fez nos dois tempos. Subestimar tempo
  de viagem rende reclamação em avaliação; a faixa é honesta nas duas pontas.
- **`FAQPage` no JSON-LD exige a mesma pergunta visível na página.** Schema sem conteúdo
  correspondente é penalizado. Ao adicionar pergunta no JSON-LD, adicione o `<details>`
  junto — e valide a paridade por script, não no olho.
