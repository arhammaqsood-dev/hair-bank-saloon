/* ════════════════════════════════════════════
   HAIR BANK MEN'S SALOON — script.js
   Vanilla JavaScript — clean & modular
   ════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   1. SCROLL PROGRESS BAR
────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ──────────────────────────────────────────
   2. NAVBAR — scroll state + hamburger
────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const hamburgerIcon = document.getElementById('hamburger-icon');
const mobileMenu = document.getElementById('mobile-menu');

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  navbar.classList.toggle('menu-open', isOpen);

  // swap icon
  if (isOpen) {
    hamburgerIcon.classList.replace('fa-bars', 'fa-xmark');
  } else {
    hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
  }
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  navbar.classList.remove('menu-open');
  hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
}

hamburger.addEventListener('click', toggleMenu);

/* ──────────────────────────────────────────
   3. SMOOTH SCROLL HELPERS
────────────────────────────────────────── */
function scrollToTop(e) {
  if (e) e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navScrollTo(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function mobileNavTo(e, id) {
  navScrollTo(e, id);
  closeMenu();
}

/* Make helpers available globally (called from inline HTML onclick) */
window.scrollToTop  = scrollToTop;
window.navScrollTo  = navScrollTo;
window.mobileNavTo  = mobileNavTo;

/* ──────────────────────────────────────────
   4. SCROLL REVEAL (Intersection Observer)
────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); /* trigger once */
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────
   5. ANIMATED COUNTERS
────────────────────────────────────────── */
const counterEls = document.querySelectorAll('[data-target]');

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const suffix   = el.getAttribute('data-suffix') || '';
  const duration = 2000; /* ms */
  const fps      = 60;
  const steps    = Math.round((duration / 1000) * fps);
  const increment = target / steps;
  let current    = 0;
  let frame      = 0;

  const timer = setInterval(() => {
    frame++;
    current += increment;
    if (frame >= steps || current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 1000 / fps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

/* ──────────────────────────────────────────
   6. TESTIMONIALS CAROUSEL
────────────────────────────────────────── */
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots             = document.querySelectorAll('.dot');
const prevBtn          = document.getElementById('prev-btn');
const nextBtn          = document.getElementById('next-btn');

let currentSlide  = 0;
let autoSlideTimer = null;

function showSlide(index) {
  /* clamp / wrap */
  currentSlide = ((index % testimonialCards.length) + testimonialCards.length) % testimonialCards.length;

  testimonialCards.forEach((card, i) => {
    card.classList.toggle('active', i === currentSlide);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(() => showSlide(currentSlide + 1), 4000);
}

function stopAutoSlide() {
  if (autoSlideTimer) clearInterval(autoSlideTimer);
}

nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); startAutoSlide(); });
prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); startAutoSlide(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(parseInt(dot.getAttribute('data-dot'), 10));
    startAutoSlide();
  });
});

/* Pause on hover */
const testimonialsRight = document.querySelector('.testimonials-right');
if (testimonialsRight) {
  testimonialsRight.addEventListener('mouseenter', stopAutoSlide);
  testimonialsRight.addEventListener('mouseleave', startAutoSlide);
}

/* Init */
showSlide(0);
startAutoSlide();

/* ──────────────────────────────────────────
   7. FOOTER — dynamic year
────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ──────────────────────────────────────────
   8. UNIFIED SCROLL HANDLER (passive)
────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNavbar();
}, { passive: true });

/* Run once on load to set initial states */
updateProgress();
updateNavbar();
