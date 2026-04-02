/* ═══════════════════════════════════════════
   PSICOLOGÍA WEB · JS PRINCIPAL
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ─────────────────────── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── BURGER MENU ───────────────────────── */
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks  = document.getElementById('navLinks');

  burgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── AUDIO PLAYERS ─────────────────────── */
  const playBtns = document.querySelectorAll('.audio-play-btn');
  let currentAudio = null;
  let currentBtn   = null;

  playBtns.forEach(btn => {
    const audioId    = btn.dataset.audio;
    const audio      = document.getElementById(audioId);
    const progressEl = document.getElementById('progress' + audioId.replace('audio', ''));
    const timeEl     = document.getElementById('time'     + audioId.replace('audio', ''));

    if (!audio) return;

    btn.addEventListener('click', () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentBtn.classList.remove('playing');
        currentBtn.querySelector('.play-icon').textContent = '▶';
      }

      if (audio.paused) {
        audio.play().catch(() => {
          /* Si no hay archivo real, silencia el error */
        });
        btn.classList.add('playing');
        btn.querySelector('.play-icon').textContent = '⏸';
        currentAudio = audio;
        currentBtn   = btn;
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.querySelector('.play-icon').textContent = '▶';
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      progressEl.style.width = pct + '%';
      timeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      btn.classList.remove('playing');
      btn.querySelector('.play-icon').textContent = '▶';
      progressEl.style.width = '0%';
      timeEl.textContent = '0:00';
    });

    /* Click en barra de progreso */
    const progressWrap = progressEl.closest('.audio-progress-wrap');
    progressWrap.addEventListener('click', e => {
      if (!audio.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });
  });

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  /* ── CONTACT FORM ──────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.disabled = true;

      /* ──────────────────────────────────────
         INTEGRACIÓN REAL:
         Sustituye este bloque por tu servicio:
         - Formspree:  action="https://formspree.io/f/YOUR_ID"  method="POST"
         - EmailJS:    emailjs.send(...)
         - Backend propio: fetch('/api/contact', { method:'POST', body: FormData })
      ────────────────────────────────────── */
      await new Promise(r => setTimeout(r, 1200)); // simula envío

      contactForm.hidden = true;
      formSuccess.hidden = false;
    });
  }

  /* ── INTERSECTION OBSERVER (fade-in) ───── */
  const fadeEls = document.querySelectorAll(
    '.servicio-card, .podcast-card, .libro-card, .descargable-card, .tarifa-card, .timeline-item, .evento-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  /* Añadir estado inicial */
  const style = document.createElement('style');
  style.textContent = `
    .servicio-card, .podcast-card, .libro-card,
    .descargable-card, .tarifa-card, .timeline-item, .evento-card {
      opacity: 0;
      transform: translateY(20px);
    }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  fadeEls.forEach((el, i) => {
    el.style.animationDelay = (i * 0.05) + 's';
    observer.observe(el);
  });

  /* ── COOKIE BANNER ─────────────────────── */
  const cookieBanner = document.getElementById('cookieBanner');
  const COOKIE_KEY = 'psico_cookies_accepted';

  if (!localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => { cookieBanner.hidden = false; }, 2000);
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'all');
    cookieBanner.hidden = true;
  });
  document.getElementById('cookieReject')?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'essential');
    cookieBanner.hidden = true;
  });

  /* ── YEAR ──────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── ACTIVE NAV LINK ───────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.navbar__links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAs.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

});
