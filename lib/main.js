/* Casa do Chapéu Caparaó — interações (ES2024, sem dependências) */

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Loader ---------- */
// Some assim que o DOM está pronto (este script roda com defer):
// não bloqueia o LCP e só aparece de fato em conexões lentas.
const loader = document.getElementById('pageLoader');
requestAnimationFrame(() => loader?.classList.add('done'));

/* ---------- Header: estado ao rolar ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

/* ---------- Menu mobile ---------- */
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
navToggle.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});
primaryNav.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && header.classList.contains('nav-open')) {
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

/* ---------- Tema claro/escuro ---------- */
document.getElementById('themeToggle').addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme !== 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  localStorage.setItem('cdc-theme', dark ? 'dark' : 'light');
});

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

for (const el of document.querySelectorAll('.reveal')) revealObserver.observe(el);

/* ---------- Parallax leve (desativado com prefers-reduced-motion) ---------- */
const parallaxItems = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
  el,
  factor: parseFloat(el.dataset.parallax) || 0.15,
}));

let parallaxTicking = false;
const applyParallax = () => {
  parallaxTicking = false;
  const vh = innerHeight;
  for (const { el, factor } of parallaxItems) {
    const box = (el.closest('section') ?? el).getBoundingClientRect();
    if (box.bottom < 0 || box.top > vh) continue;
    const progress = (box.top + box.height / 2 - vh / 2) / (vh + box.height);
    el.style.transform = `translateY(${(-progress * factor * 100).toFixed(2)}px)`;
  }
};
if (!reducedMotion.matches && parallaxItems.length) {
  addEventListener('scroll', () => {
    if (!parallaxTicking) {
      parallaxTicking = true;
      requestAnimationFrame(applyParallax);
    }
  }, { passive: true });
  applyParallax();
}

/* ---------- Lightbox da galeria ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const galleryLinks = [...document.querySelectorAll('[data-lightbox]')];
let currentIndex = 0;

const showSlide = (index) => {
  currentIndex = (index + galleryLinks.length) % galleryLinks.length;
  const link = galleryLinks[currentIndex];
  const alt = link.querySelector('img')?.alt ?? '';
  lightboxImg.src = link.href;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = link.dataset.caption ?? alt;
};

galleryLinks.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showSlide(index);
    lightbox.showModal();
  });
});

lightbox.querySelector('[data-lb-close]').addEventListener('click', () => lightbox.close());
lightbox.querySelector('[data-lb-prev]').addEventListener('click', () => showSlide(currentIndex - 1));
lightbox.querySelector('[data-lb-next]').addEventListener('click', () => showSlide(currentIndex + 1));

lightbox.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
  if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
});

// Fecha ao clicar fora da imagem (no backdrop)
lightbox.addEventListener('click', (e) => {
  const rect = lightbox.getBoundingClientRect();
  const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) lightbox.close();
});

lightbox.addEventListener('close', () => {
  lightboxImg.src = '';
  galleryLinks[currentIndex]?.focus();
});

/* ---------- Avaliações do Google (curadoria em assets/data/reviews.json) ---------- */
const STAR_PATH = 'm12 2 3 6.6 7 .9-5.2 4.8 1.4 7-6.2-3.6L5.8 21l1.4-7L2 9.5l7-.9L12 2Z';
const AVATAR_COLORS = ['#e9a94f', '#7fa98c', '#c98a6a', '#8fa3c9', '#b48ac9'];

const starsSvg = (rating, size = 18) => {
  let out = '';
  for (let i = 1; i <= 5; i++) {
    const fill = i <= rating ? 'currentColor' : 'rgb(255 255 255 / .25)';
    out += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
  }
  return out;
};

const formatMonth = (iso) => {
  const [y, m] = iso.split('-').map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const renderGoogleReviews = async () => {
  const grid = document.getElementById('googleReviews');
  if (!grid) return;
  try {
    const res = await fetch('assets/data/reviews.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();

    document.getElementById('gRating').textContent = data.rating.toLocaleString('pt-BR', { minimumFractionDigits: 1 });
    document.getElementById('gCount').textContent = `${data.total} avaliações no Google`;
    const gStars = document.getElementById('gStars');
    gStars.innerHTML = starsSvg(Math.round(data.rating), 22);
    gStars.setAttribute('aria-label', `Nota ${data.rating.toLocaleString('pt-BR')} de 5 no Google`);
    document.getElementById('gLink').href = data.url;

    for (const [i, review] of data.reviews.entries()) {
      const card = document.createElement('article');
      card.className = 'review-card reveal';
      card.style.setProperty('--reveal-delay', `${(i % 3) * 100}ms`);

      const head = document.createElement('div');
      head.className = 'review-head';
      const avatar = document.createElement('span');
      avatar.className = 'review-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = review.name.charAt(0).toUpperCase();
      avatar.style.background = AVATAR_COLORS[i % AVATAR_COLORS.length];
      const meta = document.createElement('div');
      meta.className = 'review-meta';
      const name = document.createElement('strong');
      name.textContent = review.name;
      const when = document.createElement('span');
      when.textContent = `${formatMonth(review.date)} · Google`;
      meta.append(name, when);
      const gMini = document.createElement('span');
      gMini.className = 'g-mini';
      gMini.innerHTML = '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.4 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9.1h12.4c-.5 2.9-2.2 5.4-4.6 7.1l7.5 5.8c4.4-4.1 6.8-10.1 6.8-17.5z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.3 0-11.6-3.9-13.5-9.3l-7.9 6.2C6.5 42.6 14.6 48 24 48z"/></svg>';
      head.append(avatar, meta, gMini);

      const stars = document.createElement('div');
      stars.className = 'review-stars';
      stars.setAttribute('role', 'img');
      stars.setAttribute('aria-label', `Avaliação: ${review.rating} de 5 estrelas`);
      stars.innerHTML = starsSvg(review.rating);

      const quote = document.createElement('blockquote');
      quote.textContent = `“${review.text}”`;

      card.append(head, stars, quote);
      grid.append(card);
      revealObserver.observe(card);
    }
  } catch {
    // Sem JSON acessível: mantém o link do noscript/summary como caminho para o Google
    grid.insertAdjacentHTML('beforeend',
      '<p class="g-noscript">Veja nossas avaliações na <a href="https://search.google.com/local/reviews?placeid=ChIJKY4kGO-juwARScvIFzKcThQ" target="_blank" rel="noopener">ficha do Google</a>.</p>');
  }
};
renderGoogleReviews();
