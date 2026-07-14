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
