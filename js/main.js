/* ============================================================
   Binary Bridge AI — main.js
   Shared interaction layer: header state, mobile nav, scroll
   reveals, marquee, BUILD/MARKET/OPTIMIZE, FAQ accordion,
   testimonial video controls, form validation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initBMO();
  initFAQ();
  initTestimonials();
  initContactForm();
  initNewsletterForm();
  initSmoothAnchors();
  initYear();
});

/* -------------------- Header scroll state -------------------- */
function initHeaderScroll(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const setState = () => {
    if(window.scrollY > 40){ header.classList.add('is-scrolled'); }
    else{ header.classList.remove('is-scrolled'); }
  };
  setState();
  window.addEventListener('scroll', setState, { passive:true });
}

/* -------------------- Mobile navigation -------------------- */
function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if(!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openNav = () => {
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  if(closeBtn){
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeNav();
    });
  }

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeNav();
  });
}

/* -------------------- Scroll reveal -------------------- */
function initScrollReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:.15, rootMargin:'0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
}

/* -------------------- BUILD / MARKET / OPTIMIZE -------------------- */
function initBMO(){
  const panels = document.querySelectorAll('.bmo-panel');
  if(!panels.length) return;

  panels.forEach(panel => {
    panel.addEventListener('click', () => {
      const alreadyActive = panel.classList.contains('is-active');
      panels.forEach(p => p.classList.remove('is-active'));
      if(!alreadyActive) panel.classList.add('is-active');
    });
  });
}

/* -------------------- FAQ accordion -------------------- */
function initFAQ(){
  const items = document.querySelectorAll('.faq-item');
  if(!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if(!btn || !answer) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
        const otherAnswer = other.querySelector('.faq-a');
        if(otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if(!isOpen){
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* -------------------- Testimonial video controls -------------------- */
function initTestimonials(){
  const cards = document.querySelectorAll('.testimonial-card');
  if(!cards.length) return;

  cards.forEach(card => {
    const btn = card.querySelector('.play-btn');
    const video = card.querySelector('video');
    if(!btn) return;

    btn.addEventListener('click', () => {
      if(!video){ return; }
      card.classList.add('is-playing');
      video.muted = false;
      video.play().catch(() => {});
    });
  });
}

/* -------------------- Contact form validation -------------------- */
function initContactForm(){
  const form = document.querySelector('#inquiry-form');
  if(!form) return;

  const success = form.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[data-required]').forEach(field => {
      const wrapper = field.closest('.form-field');
      const value = field.value.trim();
      let fieldValid = value.length > 0;

      if(field.type === 'email' && value){
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      wrapper.classList.toggle('error', !fieldValid);
      if(!fieldValid) valid = false;
    });

    if(!valid) return;

    /* NOTE: no backend is configured. This is a frontend-only
       interface. Wire this up to a form service (e.g. an email
       API or CRM webhook) to accept live submissions. */
    if(success){
      success.classList.add('is-visible');
      success.textContent = 'Thanks — your inquiry has been prepared. (Form submission is not yet connected to a backend.)';
    }
    form.reset();
  });

  form.querySelectorAll('[data-required]').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-field').classList.remove('error');
    });
  });
}

/* -------------------- Newsletter form -------------------- */
function initNewsletterForm(){
  const form = document.querySelector('#newsletter-form');
  if(!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const note = form.querySelector('.newsletter-note');
    if(input && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())){
      input.focus();
      return;
    }
    if(note) note.textContent = 'Subscribed. (Newsletter delivery is not yet connected to a backend.)';
    form.reset();
  });
}

/* -------------------- Smooth anchor scrolling -------------------- */
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });
}

/* -------------------- Footer year -------------------- */
function initYear(){
  const el = document.querySelector('[data-year]');
  if(el) el.textContent = new Date().getFullYear();
}
