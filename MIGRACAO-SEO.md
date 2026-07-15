# Guia de Migração e SEO — Casa do Chapéu Caparaó

Passo a passo para tirar o site do Wix, publicá-lo no seu domínio via VPS/Dokploy
e registrá-lo nos buscadores e IAs. Siga **na ordem** — cada fase depende da anterior.

> **Situação atual (diagnóstico):** o domínio `casadochapeucaparao.com` foi
> transferido para o GoDaddy, mas os **nameservers ainda são do Wix**
> (`ns12.wixdns.net`, `ns13.wixdns.net`). Enquanto isso não mudar, quem controla
> para onde o domínio aponta é o **Wix**, não o GoDaddy. Esta é a primeira coisa a resolver.

---

## Conceito que evita confusão

Existem três coisas diferentes, muitas vezes tratadas como uma só:

1. **Registro do domínio** — de onde você paga/renova. Já está no GoDaddy. ✅
2. **Nameservers** — quem responde "para onde este domínio aponta?". Ainda são do Wix. ❌
3. **Registros DNS** (A, CNAME…) — as regras específicas de apontamento. Você só
   consegue editar de verdade depois que os nameservers forem os do GoDaddy.

**Airbnb, Booking, Expedia não são afetados por nada disso.** São plataformas com
domínio próprio; sua hospedagem tem um anúncio *dentro* delas. Trocar o seu site
não mexe nesses anúncios — o site novo apenas linka para eles. Você está reformando
só a "sua loja própria" (`casadochapeucaparao.com`), que hoje ainda serve o Wix.

---

## FASE 1 — Apontar o domínio para a VPS

### Passo 1.1 — Trocar os nameservers para o GoDaddy

No painel do **GoDaddy** → seu domínio → **DNS** / **Nameservers**:

- Procure a opção de nameservers. Se estiver como "Personalizado" apontando para
  `wixdns.net`, troque para **"Usar os nameservers padrão do GoDaddy"**
  (algo como `ns__.domaincontrol.com`).
- Salve. A propagação leva de **algumas horas até 48h** (geralmente < 4h).

> Enquanto os nameservers forem do Wix, os passos seguintes de DNS **não terão efeito**.

### Passo 1.2 — Publicar o site no Dokploy

No **Dokploy**:

1. **Create Application** → Source: **GitHub** → repositório `CarneiroBode/casadochapeu`,
   branch `master` → Build Type: **Dockerfile**.
2. Deploy. O container sobe servindo na porta **8080** (já configurado no Dockerfile).
3. Confirme que o site abre pelo endereço temporário do Dokploy (IP:porta ou subdomínio).

### Passo 1.3 — Criar os registros DNS (após nameservers já no GoDaddy)

No **GoDaddy** → DNS → **Gerenciar registros**. Deixe assim
(substitua `SEU.IP.DA.VPS` pelo IP público real da VPS):

| Tipo  | Nome | Valor            | TTL    |
|-------|------|------------------|--------|
| A     | `@`  | `SEU.IP.DA.VPS`  | 600    |
| CNAME | `www`| `casadochapeucaparao.com` | 600 |

- Remova quaisquer registros A/CNAME antigos apontando para o Wix
  (`wixdns.net`, `185.230.63.x`, `34.149.87.45`).
- O registro `A @` faz o domínio raiz apontar para a VPS.
- O `CNAME www` faz `www.` seguir o domínio raiz (o site já trata os dois via
  `server_name` no nginx e `canonical` no HTML).

### Passo 1.4 — Domínio + HTTPS no Traefik (Dokploy)

Na Application do Dokploy → **Domains**:

1. Adicione `casadochapeucaparao.com` **e** `www.casadochapeucaparao.com`.
2. Container port: **8080**.
3. Ative **HTTPS / Let's Encrypt** (como nos seus outros projetos).
4. Defina o redirecionamento de `www` → domínio raiz (ou vice-versa) — escolha uma
   versão canônica. O site usa `https://www.casadochapeucaparao.com/` como canonical,
   então o ideal é redirecionar a raiz para o `www` **ou** ajustar o canonical.
   (Ver nota em "Ajuste de canonical" abaixo.)

### Passo 1.5 — Validar

Depois da propagação:

- `https://casadochapeucaparao.com` e `https://www.casadochapeucaparao.com` abrem o site novo.
- Cadeado de HTTPS válido (Let's Encrypt).
- F12 → aba **Console**: nenhum erro vermelho de CSP (o mapa e o tema devem funcionar —
  já corrigidos no commit da CSP).

---

## FASE 2 — Registrar nos buscadores

> Só faça depois que o site novo estiver abrindo no domínio real com HTTPS.

### Passo 2.1 — Google Search Console

1. Acesse https://search.google.com/search-console (logado na conta Google que
   gerencia a ficha da hospedagem).
2. **Adicionar propriedade** → escolha **Domínio** (cobre http/https, www e raiz de uma vez).
3. O Google pede um registro **TXT** de verificação. Copie-o.
4. No GoDaddy → DNS → adicione um registro **TXT** com o valor fornecido. Salve.
5. Volte ao Search Console e clique em **Verificar** (pode levar alguns minutos).
6. Verificado: menu **Sitemaps** → envie `sitemap.xml` (só digite `sitemap.xml`).
7. Menu **Inspeção de URL** → cole `https://www.casadochapeucaparao.com/` →
   **Solicitar indexação** (acelera a primeira visita do Google).

### Passo 2.2 — Bing Webmaster Tools (cobre Bing, DuckDuckGo, Brave, e IAs)

1. Acesse https://www.bing.com/webmasters
2. **Importar do Google Search Console** (mais rápido) — ou adicionar manualmente
   e verificar por TXT, do mesmo jeito do passo 2.1.
3. Envie o `sitemap.xml`.

### Passo 2.3 — (Opcional) IndexNow

O Bing/Yandex suportam IndexNow para indexação instantânea. Não é essencial para um
site pequeno, mas se quiser, dá para configurar depois.

---

## FASE 3 — Autoridade e operação contínua

### Passo 3.1 — Google Business Profile (a ficha das 27 avaliações)

Você já gerencia a ficha. Faça:

1. Acesse https://business.google.com
2. No campo **Site**, coloque `https://www.casadochapeucaparao.com/`
   (antes provavelmente apontava para o Wix — atualize).
3. Confirme categoria ("Hospedagem"/"Pousada"), horário, fotos e telefone.
4. Fotos boas + informações completas pesam **tanto quanto o site** nas buscas locais
   ("hospedagem Caparaó", "pousada Patrimônio da Penha").

### Passo 3.2 — Backlinks (link do site novo espalhado)

Atualize o endereço do site para `https://www.casadochapeucaparao.com/` em:

- **Instagram** (@casadochapeu_caparao) — link na bio
- **Airbnb** e **Booking** — se houver campo de site/descrição
- **TripAdvisor** (a ficha já existe)
- Guias de turismo da região (patrimoniodapenha.com.br, associações locais)
- Assinatura de e-mail, cartão de visitas digital, etc.

Cada link relevante apontando para o domínio constrói autoridade ao longo das semanas.

### Passo 3.3 — Manter avaliações atualizadas

Conforme novas avaliações chegam no Google, atualize `assets/data/reviews.json`
(campo `total` e, se quiser, adicione novos textos no array `reviews`). Mantenha o
`reviewCount` do JSON-LD (em `index.html`) **igual ao total real** — nunca maior,
para não arriscar penalização dos rich snippets.

---

## Ajuste de canonical (decisão a tomar)

O site usa `https://www.casadochapeucaparao.com/` como versão canônica (com `www`).
Garanta que o Traefik **redirecione a raiz para o www** (ou o contrário, mas então
me avise para eu trocar o canonical, o OG e o sitemap para a versão sem `www`).
O importante é: **uma única versão canônica**, para não dividir a autoridade de SEO.

---

## Checklist rápido

- [ ] Nameservers trocados para o GoDaddy (Fase 1.1)
- [ ] Site publicado no Dokploy (1.2)
- [ ] Registros A/CNAME criados no GoDaddy (1.3)
- [ ] Domínio + HTTPS no Traefik (1.4)
- [ ] Site abre no domínio real com cadeado, sem erro de CSP (1.5)
- [ ] Google Search Console verificado + sitemap enviado (2.1)
- [ ] Bing Webmaster Tools + sitemap (2.2)
- [ ] Google Business Profile com o site novo (3.1)
- [ ] Link do site atualizado no Instagram/Airbnb/Booking/TripAdvisor (3.2)

---

## Sobre "quanto tempo até aparecer no Google?"

- Indexação da home: de **horas a poucos dias** após enviar o sitemap e solicitar indexação.
- Ranqueamento por termos ("hospedagem Caparaó"): **semanas**, evoluindo conforme
  autoridade e cliques.
- Estrelas (rich snippet do `aggregateRating`): aparecem **depois** que o Google
  confia nos dados estruturados — costuma levar de dias a algumas semanas após a indexação.
