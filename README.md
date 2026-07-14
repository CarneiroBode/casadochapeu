# Casa do Chapéu Caparaó — Landing Page

Landing page estática de alta performance para a **Hospedagem Casa do Chapéu Caparaó**
(Patrimônio da Penha, Divino de São Lourenço · ES).

## Stack

HTML5 + CSS moderno + JavaScript ES2024, **sem build e sem dependências de runtime**.
A escolha por site estático (em vez de Next.js) foi deliberada: zero JavaScript de
framework, carregamento instantâneo e pontuação máxima no Lighthouse.

- Fontes self-hosted (`Fraunces` + `Inter`, woff2 variável, subset latin)
- Imagens em WebP com `srcset` responsivo, `lazy loading` e preload apenas do hero
- Dark mode automático (`prefers-color-scheme`) com toggle persistido em `localStorage`
- Scroll reveal, parallax leve e lightbox nativos (IntersectionObserver + `<dialog>`),
  respeitando `prefers-reduced-motion`
- SEO completo: meta tags, Open Graph, Twitter Cards, sitemap com imagens, robots.txt,
  JSON-LD (`LodgingBusiness` + `FAQPage`)
- Acessibilidade WCAG AA: navegação por teclado, ARIA, skip link, alt em todas as imagens

## Estrutura

```
index.html            Página única (landing)
robots.txt            Diretivas para indexadores
sitemap.xml           Sitemap com extensão de imagens
site.webmanifest      Manifest PWA básico
assets/
  images/             Fotos do site original otimizadas em WebP + ícones/favicons
  fonts/              Fraunces e Inter (woff2 variável)
styles/
  main.css            Design system + estilos (tokens, componentes, seções)
lib/
  main.js             Interações (menu, tema, reveal, parallax, lightbox)
```

## Como rodar localmente

Qualquer servidor estático serve. Exemplos:

```sh
npx serve .
# ou
python -m http.server 8000
```

## Deploy (VPS com Dokploy + Traefik)

O repositório inclui `Dockerfile` + `nginx.conf` prontos para produção:

- nginx **não-root** (`nginxinc/nginx-unprivileged`) escutando na porta **8080**
- gzip para HTML/CSS/JS/SVG, cache imutável de 1 ano para imagens e fontes
- cabeçalhos de segurança (TLS/HSTS ficam a cargo do Traefik)
- healthcheck em `/healthz`

Passos no Dokploy:

1. Criar **Application** apontando para este repositório GitHub (branch `master`),
   build type **Dockerfile**.
2. Definir a porta do container como **8080** no domínio/Traefik.
3. Configurar o domínio + Let's Encrypt no Traefik (como nos demais projetos).
4. Ativar o **webhook de auto-deploy** (Dokploy gera a URL; cadastrar no GitHub em
   Settings → Webhooks) — cada push no `master` redeploya o site.

Estrutura estática: também funciona em qualquer host estático (Netlify, Cloudflare
Pages, GitHub Pages) sem nenhum build.

## Links de negócio (não alterar sem confirmar com o cliente)

- **WhatsApp (reservas):** `https://wa.me/5527981811985?text=Olá! Vi a hospedagem no site e gostaria de mais informações!`
  — mesmo número do site original (27 98181-1985), com o código do Brasil (55)
  adicionado para compatibilidade total com o formato exigido pelo wa.me.
- **Airbnb:** `airbnb.com.br/h/casadochapeu-lua`
- **Booking:** `booking.com/hotel/br/hospedagem-casa-do-chapeu.pt-br.html`
- **Instagram:** `@casadochapeu_caparao`
- **Avaliações Google (ler):** `https://search.google.com/local/reviews?placeid=ChIJKY4kGO-juwARScvIFzKcThQ`
  — usado no botão "Ver avaliações no Google" (Place ID oficial da ficha).
- **Avaliações Google (escrever):** `https://g.page/r/CUnLyBcynE4UEBM/review`
  — link curto do perfil para pedir avaliações a hóspedes (ex.: pós-checkout).
