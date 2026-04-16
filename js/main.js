/* ═══════════════════════════════════════════
   PSICOLOGÍA WEB · JS PRINCIPAL
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {




  /* ── NAVBAR — gestionado por scroll horizontal ── */
  const navbar = document.getElementById('navbar');

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

      const data = {
        nombre:   contactForm.nombre.value,
        email:    contactForm.email.value,
        telefono: contactForm.telefono.value,
        servicio: contactForm.servicio.value,
        mensaje:  contactForm.mensaje.value,
      };

      try {
        const res = await fetch('/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error();
        contactForm.hidden = true;
        formSuccess.hidden = false;
      } catch {
        btn.textContent = 'Error al enviar. Inténtalo de nuevo.';
        btn.disabled = false;
      }
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
  }, { threshold: 0.08, rootMargin: '0px 0px 0px 0px' });

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

  /* ── CARRUSELES HORIZONTALES ───────────── */
  initCarousels();

  /* ── LIENZO EMOCIONAL ──────────────────── */
  initEmotionCanvas();

  /* ── SCROLL HORIZONTAL DE PÁGINA ──────── */
  initHorizontalPageScroll();

  /* ── ANIMACIÓN DE LETRAS EN NAVBAR ─────── */
  initNavAnimations();

  /* ── MURAL DE FONDO EN HERO ────────────── */
  initHeroMural();

  /* ── COLOR ALEATORIO DE EMOCIÓN AL CLIQUEAR BOTÓN ── */
  initButtonEmotionColor();

  /* ── Escala responsive del mockup iPhone (devices.css) ── */
  initIphoneScale();

});

/* ════════════════════════════════════════════
   ESCALA DEL IPHONE (devices.css es 428×868 fijo)
════════════════════════════════════════════ */
function initIphoneScale() {
  const wrap = document.querySelector('.iphone-wrap');
  if (!wrap) return;
  const apply = () => {
    const maxH = Math.min(Math.max(window.innerHeight * 0.88, 520), 820);
    const scale = +(maxH / 868).toFixed(3);
    wrap.style.setProperty('--iphone-scale', scale);
  };
  apply();
  window.addEventListener('resize', apply);
}

/* ════════════════════════════════════════════
   COLOR ALEATORIO AL PULSAR CUALQUIER BOTÓN
════════════════════════════════════════════ */
function initButtonEmotionColor() {
  const emotionColors = [
    '#e63946', /* pasión */
    '#f4a261', /* calidez */
    '#ffbe0b', /* alegría */
    '#4caf50', /* calma */
    '#4cc9f0', /* serenidad */
    '#4361ee', /* tristeza */
    '#7209b7', /* intuición */
    '#f72585', /* amor */
    '#f26c4f', /* clay */
  ];

  document.addEventListener('click', e => {
    const target = e.target.closest('button, a');
    if (!target) return;
    /* Ignorar botones de color (paleta), stickers, fondos y controles del scroll */
    if (target.classList.contains('palette-color'))        return;
    if (target.classList.contains('sticker-btn'))          return;
    if (target.classList.contains('bg-btn'))               return;
    if (target.classList.contains('tool-size'))            return;
    if (target.classList.contains('scroll-progress__dot')) return;
    if (target.closest('.cookie-banner'))                  return;

    const c = emotionColors[Math.floor(Math.random() * emotionColors.length)];
    target.style.setProperty('color', c, 'important');
    target.style.setProperty('transition', 'color 0.3s ease', 'important');

    /* Repintar todos los spans internos (char, logo-name, logo-sub, etc.) */
    target.querySelectorAll('span').forEach(sp => {
      sp.style.setProperty('color', c, 'important');
      sp.style.setProperty('transition', 'color 0.3s ease', 'important');
    });
  }, true);
}

/* ════════════════════════════════════════════
   SCROLL HORIZONTAL DE PÁGINA
════════════════════════════════════════════ */
function initHorizontalPageScroll() {
  const scroller = document.getElementById('mainScroller');
  const navbar   = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  if (!scroller) return;

  /* Slides: secciones + footer */
  const slides = Array.from(scroller.children); // section/div.slide-footer
  let currentIdx = 0;
  let isAnimating = false;

  /* Secciones con fondo oscuro → dots blancos */
  const darkSlides = new Set(['inicio', 'tarifas', 'contacto', 'emocion']);

  /* ── Crear puntos de progreso ─────────── */
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'scroll-progress__dot' + (i === 0 ? ' active' : '');
    const label = slide.id || (i === slides.length - 1 ? 'footer' : `slide-${i}`);
    dot.setAttribute('aria-label', `Ir a ${label}`);
    dot.addEventListener('click', () => goTo(i));
    progress?.appendChild(dot);
  });

  function updateProgress() {
    if (!progress) return;
    const dots = progress.querySelectorAll('.scroll-progress__dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));

    const currentSlide = slides[currentIdx];
    const isDark = currentSlide &&
      (currentSlide.classList.contains('hero') ||
       darkSlides.has(currentSlide.id) ||
       currentSlide.classList.contains('slide-footer'));
    progress.classList.toggle('on-light', !isDark);
  }

  function updateNavbar() {
    /* Scrolled cuando no estamos en el hero */
    navbar?.classList.toggle('scrolled', currentIdx > 0);

    /* Enlace activo */
    const currentId = slides[currentIdx]?.id;
    document.querySelectorAll('.navbar__links a[href^="#"]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }

  /* ── Ir a slide ───────────────────────── */
  function goTo(idx, skipAnimation = false) {
    if (idx < 0 || idx >= slides.length) return;
    if (isAnimating && !skipAnimation) return;
    isAnimating = true;
    currentIdx = idx;

    scroller.scrollTo({ left: idx * window.innerWidth, behavior: 'smooth' });

    updateProgress();
    updateNavbar();

    /* Usa scrollend si el navegador lo soporta (más preciso) */
    if ('onscrollend' in window) {
      const onEnd = () => {
        isAnimating = false;
        scroller.removeEventListener('scrollend', onEnd);
      };
      scroller.addEventListener('scrollend', onEnd, { once: true });
      /* Fallback por si scrollend no dispara */
      setTimeout(() => { isAnimating = false; }, 600);
    } else {
      setTimeout(() => { isAnimating = false; }, 500);
    }
  }

  /* ── Intercept enlaces de anclaje ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      const idx = slides.indexOf(targetEl);
      if (idx === -1) return;
      e.preventDefault();
      goTo(idx);
      /* Cerrar menú móvil */
      document.getElementById('navLinks')?.classList.remove('open');
      document.getElementById('burgerBtn')?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Rueda del ratón → horizontal ─────── */
  /* Estrategia: detectar "gesto" completo; cada gesto = un slide */
  let wheelGestureActive = false;
  let wheelGestureTimer;

  scroller.addEventListener('wheel', e => {
    /* Si el scroll del contenido interior tiene margen, dejar pasar */
    const panel = slides[currentIdx];
    if (panel) {
      const scrollable = panel.scrollHeight > panel.clientHeight + 4;
      const atTop    = panel.scrollTop <= 2;
      const atBottom = panel.scrollTop >= panel.scrollHeight - panel.clientHeight - 4;

      if (scrollable) {
        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop)    return;
      }
    }

    e.preventDefault();

    const delta = e.deltaY || e.deltaX;
    if (Math.abs(delta) < 5) return;

    /* Reset el "fin de gesto" con cada evento — la rueda dispara muchos eventos seguidos */
    clearTimeout(wheelGestureTimer);
    wheelGestureTimer = setTimeout(() => { wheelGestureActive = false; }, 180);

    /* Solo el primer evento del gesto mueve el slide */
    if (wheelGestureActive || isAnimating) return;
    wheelGestureActive = true;

    goTo(currentIdx + (delta > 0 ? 1 : -1));
  }, { passive: false });

  /* ── Teclado ──────────────────────────── */
  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key) &&
        !e.target.matches('input, textarea, select')) {
      e.preventDefault();
      goTo(currentIdx + 1);
    }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key) &&
        !e.target.matches('input, textarea, select')) {
      e.preventDefault();
      goTo(currentIdx - 1);
    }
  });

  /* ── Swipe táctil ─────────────────────── */
  let touchStartX = 0, touchStartY = 0;
  scroller.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  scroller.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      goTo(currentIdx + (dx > 0 ? 1 : -1));
    }
  }, { passive: true });

  /* ── Sincronizar al hacer scroll manual ─ */
  scroller.addEventListener('scroll', () => {
    const newIdx = Math.round(scroller.scrollLeft / window.innerWidth);
    if (newIdx !== currentIdx && !isAnimating) {
      currentIdx = newIdx;
      updateProgress();
      updateNavbar();
    }
  }, { passive: true });

  /* ── Ocultar hint tras primera interacción */
  const hint = document.getElementById('pageNavHint');
  scroller.addEventListener('scroll', () => {
    if (hint) hint.style.opacity = '0';
  }, { passive: true, once: true });

  /* Init */
  updateProgress();
  updateNavbar();
}

/* ════════════════════════════════════════════
   CARRUSELES HORIZONTALES
════════════════════════════════════════════ */
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(wrap => {
    const viewport = wrap.querySelector('.carousel-viewport');
    if (!viewport) return;

    const prevBtn = wrap.querySelector('.carousel-arrow--prev');
    const nextBtn = wrap.querySelector('.carousel-arrow--next');
    const dotsContainer = wrap.querySelector('.carousel-dots');

    /* Recoge todas las tarjetas del primer nivel de flex */
    const items = Array.from(viewport.querySelectorAll(
      '.servicio-card, .libro-card'
    ));
    if (items.length === 0) return;

    let currentIdx = 0;

    function getCardStep() {
      if (!items[0]) return 300;
      const style = getComputedStyle(viewport);
      const gap = parseFloat(style.gap) || 24;
      return items[0].offsetWidth + gap;
    }

    function getVisibleCount() {
      if (!items[0]) return 1;
      return Math.max(1, Math.floor(viewport.clientWidth / (items[0].offsetWidth + 8)));
    }

    function maxIdx() {
      return Math.max(0, items.length - getVisibleCount());
    }

    function goTo(idx) {
      currentIdx = Math.max(0, Math.min(idx, maxIdx()));
      viewport.scrollTo({ left: currentIdx * getCardStep(), behavior: 'smooth' });
      updateUI();
    }

    function updateUI() {
      if (prevBtn) prevBtn.disabled = currentIdx === 0;
      if (nextBtn) nextBtn.disabled = currentIdx >= maxIdx();
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIdx);
        });
      }
    }

    /* Crear puntos */
    if (dotsContainer) {
      const total = maxIdx() + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a posición ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    prevBtn?.addEventListener('click', () => goTo(currentIdx - 1));
    nextBtn?.addEventListener('click', () => goTo(currentIdx + 1));

    /* Drag con ratón */
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    viewport.addEventListener('mousedown', e => {
      isDragging = true;
      dragStartX = e.pageX;
      dragStartScroll = viewport.scrollLeft;
      viewport.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      viewport.scrollLeft = dragStartScroll - (e.pageX - dragStartX);
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      viewport.style.userSelect = '';
      currentIdx = Math.round(viewport.scrollLeft / getCardStep());
      goTo(currentIdx);
    });

    /* Soporte táctil (scroll-snap nativo ya funciona) */
    viewport.addEventListener('touchend', () => {
      setTimeout(() => {
        currentIdx = Math.round(viewport.scrollLeft / getCardStep());
        updateUI();
      }, 350);
    }, { passive: true });

    /* Actualizar índice al hacer scroll manual */
    viewport.addEventListener('scroll', () => {
      if (isDragging) return;
      const newIdx = Math.round(viewport.scrollLeft / getCardStep());
      if (newIdx !== currentIdx) {
        currentIdx = newIdx;
        updateUI();
      }
    }, { passive: true });

    updateUI();
  });
}

/* ════════════════════════════════════════════
   LIENZO EMOCIONAL · DIBUJA TU EMOCIÓN
════════════════════════════════════════════ */
function initEmotionCanvas() {
  const canvas = document.getElementById('emocionCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = 900, H = 500;

  canvas.width  = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  /* Fondo inicial */
  ctx.fillStyle = '#f9f7f4';
  ctx.fillRect(0, 0, W, H);

  /* Estado de dibujo */
  let isDrawing = false;
  let currentColor = '#4361ee';
  let brushSize    = 5;
  let isEraser     = false;
  let hasDrew      = false;
  let activeSticker = null; /* emoji actual para colocar en el lienzo */
  const colorUsage = {};

  /* Color de fondo dinámico — para que "Limpiar" lo respete */
  let bgFillStyle = '#f9f7f4';

  /* Prompts rotativos */
  const prompts = [
    'Dibuja cómo te sientes en este momento',
    '¿Qué forma tiene tu ansiedad hoy?',
    'Dibuja tu lugar seguro interior',
    '¿Cómo se ve el amor en tu vida ahora?',
    'Dibuja lo que necesitas soltar',
    '¿Qué color tiene tu esperanza hoy?',
    'Dibuja cómo sería sentirte en paz',
  ];
  let promptIndex = 0;
  const promptEl  = document.getElementById('emocionPrompt');
  const promptBtn = document.getElementById('promptNext');
  const hintEl    = document.getElementById('emocionHint');

  promptBtn?.addEventListener('click', () => {
    promptIndex = (promptIndex + 1) % prompts.length;
    if (promptEl) {
      promptEl.style.opacity = '0';
      promptEl.style.transform = 'translateY(8px)';
      setTimeout(() => {
        promptEl.textContent = prompts[promptIndex];
        promptEl.style.opacity = '1';
        promptEl.style.transform = 'translateY(0)';
      }, 180);
    }
  });

  /* Coordenadas ajustadas al canvas real */
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  }

  let lastX = 0, lastY = 0;

  /* Colocar un sticker en coordenadas dadas del lienzo */
  function placeSticker(emoji, x, y) {
    const fontSize = Math.max(48, brushSize * 5);
    ctx.save();
    ctx.font = `${fontSize}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","EmojiOne Color","Twemoji Mozilla",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000'; /* fallback cuando el emoji no es color */
    ctx.fillText(emoji, x, y);
    ctx.restore();
    hasDrew = true;
    if (hintEl) hintEl.classList.add('hidden');
  }

  function startDraw(e) {
    const { x, y } = getPos(e);

    /* Si hay un sticker activo, colocarlo en lugar de dibujar */
    if (activeSticker) {
      placeSticker(activeSticker, x, y);
      return;
    }

    isDrawing = true;
    lastX = x; lastY = y;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? bgFillStyle : currentColor;
    ctx.fill();

    if (!isEraser && !hasDrew) {
      hasDrew = true;
      if (hintEl) hintEl.classList.add('hidden');
    }
    if (!isEraser) colorUsage[currentColor] = (colorUsage[currentColor] || 0) + 1;
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? bgFillStyle : currentColor;
    ctx.lineWidth   = brushSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();

    if (!isEraser) colorUsage[currentColor] = (colorUsage[currentColor] || 0) + brushSize;
    lastX = x; lastY = y;
  }

  function stopDraw() { isDrawing = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup',   stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); startDraw(e); }, { passive: false });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); draw(e);      }, { passive: false });
  canvas.addEventListener('touchend',   stopDraw, { passive: true });

  /* ── Paleta de colores ─────────────────── */
  const colorData = [
    { hex: '#e63946', name: 'Pasión · Energía' },
    { hex: '#f4a261', name: 'Calidez · Creatividad' },
    { hex: '#ffbe0b', name: 'Alegría · Esperanza' },
    { hex: '#4caf50', name: 'Calma · Crecimiento' },
    { hex: '#4cc9f0', name: 'Serenidad · Claridad' },
    { hex: '#4361ee', name: 'Tristeza · Profundidad' },
    { hex: '#7209b7', name: 'Intuición · Transformación' },
    { hex: '#f72585', name: 'Amor · Ternura' },
    { hex: '#94a3b8', name: 'Incertidumbre · Neutralidad' },
    { hex: '#2d2d2d', name: 'Fuerza · Límites' },
  ];

  const paletteEl = document.getElementById('emocionPalette');
  if (paletteEl) {
    colorData.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'palette-color' + (c.hex === currentColor ? ' active' : '');
      btn.style.backgroundColor = c.hex;
      btn.title = c.name;
      btn.setAttribute('aria-label', c.name);
      btn.addEventListener('click', () => {
        currentColor = c.hex;
        isEraser = false;
        paletteEl.querySelectorAll('.palette-color').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('emocionEraser')?.classList.remove('emocion-tool-btn--active');
      });
      paletteEl.appendChild(btn);
    });
  }

  /* ── Tamaño de trazo ───────────────────── */
  document.querySelectorAll('.tool-size').forEach(btn => {
    btn.addEventListener('click', () => {
      brushSize = parseInt(btn.dataset.size, 10);
      document.querySelectorAll('.tool-size').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ── Borrador ──────────────────────────── */
  const eraserBtn = document.getElementById('emocionEraser');
  eraserBtn?.addEventListener('click', function () {
    isEraser = !isEraser;
    this.classList.toggle('emocion-tool-btn--active', isEraser);
    if (!isEraser && paletteEl) {
      paletteEl.querySelectorAll('.palette-color').forEach(b => {
        b.classList.toggle('active', b.style.backgroundColor === hexToRgb(currentColor));
      });
    }
  });

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  /* ── Limpiar ───────────────────────────── */
  document.getElementById('emocionClear')?.addEventListener('click', () => {
    bgFillStyle = '#f9f7f4';
    ctx.fillStyle = bgFillStyle;
    ctx.fillRect(0, 0, W, H);
    Object.keys(colorUsage).forEach(k => delete colorUsage[k]);
    hasDrew = false;
    activeSticker = null;
    document.querySelectorAll('.sticker-btn.active').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.bg-btn.active').forEach(b => b.classList.remove('active'));
    if (hintEl) hintEl.classList.remove('hidden');
    const statusEl = document.getElementById('emocionStatus');
    if (statusEl) statusEl.hidden = true;
  });

  /* ── Descargar ─────────────────────────── */
  document.getElementById('emocionDownload')?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'mi-emocion.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  /* ── Añadir al Mural ────────────────────── */
  const saveBtn = document.getElementById('emocionSave');

  saveBtn?.addEventListener('click', async () => {
    const statusEl = document.getElementById('emocionStatus');

    if (!hasDrew) {
      showStatus(statusEl, 'Dibuja algo en el lienzo antes de añadirlo al mural.', false);
      return;
    }

    const origText = saveBtn.textContent;
    saveBtn.textContent = 'Comprobando…';
    saveBtn.disabled = true;

    const safe = await isContentSafe(canvas);

    if (!safe) {
      saveBtn.textContent = origText;
      saveBtn.disabled = false;
      showStatus(statusEl,
        '⚠ Este contenido no puede añadirse al mural. Por favor, mantén un espacio respetuoso.',
        true);
      return;
    }

    /* Guardar en localStorage */
    const MURAL_KEY = 'psico_mural';
    const entry = {
      id: Date.now().toString(),
      dataUrl: canvas.toDataURL('image/png'),
      prompt: document.getElementById('emocionPrompt')?.textContent || '',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    try {
      const mural = JSON.parse(localStorage.getItem(MURAL_KEY) || '[]');
      mural.unshift(entry);
      if (mural.length > 60) mural.pop();
      localStorage.setItem(MURAL_KEY, JSON.stringify(mural));
    } catch {
      /* localStorage lleno o bloqueado */
    }

    saveBtn.textContent = origText;
    saveBtn.disabled = false;

    if (statusEl) {
      statusEl.innerHTML = `
        <div class="status__ok">
          <span class="status__msg">✦ Tu emoción ha sido añadida al mural.</span>
          <a href="mural.html" class="btn btn--ghost btn--sm" target="_blank">Ver el Mural →</a>
        </div>
      `;
      statusEl.hidden = false;
    }
  });

  function showStatus(el, msg, isError) {
    if (!el) return;
    el.innerHTML = `<p class="status__msg${isError ? ' status__msg--error' : ''}">${msg}</p>`;
    el.hidden = false;
  }

  /* ── Stickers de emociones ─────────────── */
  const stickers = ['❤️','✨','🌸','☀️','🌙','☁️','🌊','🍃','🔥','⭐','🦋','🕊️','🌈','💧'];
  const stickersEl = document.getElementById('stickersRow');
  if (stickersEl) {
    stickers.forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'sticker-btn';
      btn.type = 'button';
      btn.textContent = emoji;
      btn.setAttribute('aria-label', `Sticker ${emoji}`);
      btn.addEventListener('click', () => {
        /* 1) Colocar uno inmediatamente en una posición aleatoria */
        const marginX = 80, marginY = 60;
        const x = marginX + Math.random() * (W - marginX * 2);
        const y = marginY + Math.random() * (H - marginY * 2);
        placeSticker(emoji, x, y);

        /* 2) Activar el sticker para clicks adicionales en el lienzo */
        activeSticker = emoji;
        stickersEl.querySelectorAll('.sticker-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        isEraser = false;
        document.getElementById('emocionEraser')?.classList.remove('emocion-tool-btn--active');
      });
      stickersEl.appendChild(btn);
    });
  }

  /* ── Fondos de naturaleza (Unsplash) ───── */
  const backgrounds = [
    { name: 'Bosque',    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85' },
    { name: 'Océano',    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&q=85' },
    { name: 'Montaña',   url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85' },
    { name: 'Atardecer', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1600&q=85' },
    { name: 'Flores',    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&q=85' },
    { name: 'Niebla',    url: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600&q=85' },
    { name: 'Cielo',     url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&q=85' },
    { name: 'Hojas',     url: 'https://images.unsplash.com/photo-1507783548227-544c3b8fc065?w=1600&q=85' },
  ];
  const bgEl = document.getElementById('backgroundsRow');
  if (bgEl) {
    /* Botón de "limpiar fondo" */
    const clearBtn = document.createElement('button');
    clearBtn.className = 'bg-btn bg-btn--clear';
    clearBtn.type = 'button';
    clearBtn.title = 'Sin fondo';
    clearBtn.setAttribute('aria-label', 'Sin fondo');
    clearBtn.addEventListener('click', () => {
      bgFillStyle = '#f9f7f4';
      ctx.fillStyle = bgFillStyle;
      ctx.fillRect(0, 0, W, H);
      hasDrew = false;
      if (hintEl) hintEl.classList.remove('hidden');
      bgEl.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
      clearBtn.classList.add('active');
    });
    bgEl.appendChild(clearBtn);

    backgrounds.forEach(bg => {
      const btn = document.createElement('button');
      btn.className = 'bg-btn';
      btn.type = 'button';
      btn.title = bg.name;
      btn.setAttribute('aria-label', `Fondo ${bg.name}`);
      /* Thumbnail rápido — la imagen completa se carga al hacer click */
      btn.style.backgroundImage = `url(${bg.url}&w=120)`;
      btn.addEventListener('click', () => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          /* Cubrir el lienzo manteniendo proporción (object-fit: cover) */
          const scale = Math.max(W / img.width, H / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          const dx = (W - dw) / 2;
          const dy = (H - dh) / 2;
          ctx.drawImage(img, dx, dy, dw, dh);
          /* Color de fondo medio para que el borrador no haga huecos blancos crudos */
          bgFillStyle = '#888';
          hasDrew = true;
          if (hintEl) hintEl.classList.add('hidden');
        };
        img.onerror = () => {
          showStatus(document.getElementById('emocionStatus'),
            'No se pudo cargar el fondo. Comprueba tu conexión.', true);
        };
        img.src = bg.url;
        bgEl.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      bgEl.appendChild(btn);
    });
  }
}

/* ════════════════════════════════════════════
   ANIMACIÓN DE LETRAS EN NAVBAR
════════════════════════════════════════════ */
function initNavAnimations() {
  const links = document.querySelectorAll('.navbar__links a:not(.btn-nav)');
  links.forEach(link => {
    const text = link.textContent.trim();
    link.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--i', i);
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      link.appendChild(span);
    });
  });
}

/* ════════════════════════════════════════════
   MURAL DE FONDO EN HERO
════════════════════════════════════════════ */
function initHeroMural() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  /* Crear el contenedor si no existe */
  let bg = hero.querySelector('.hero__mural-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'hero__mural-bg';
    hero.insertBefore(bg, hero.firstChild);
  }

  function populateMural() {
    bg.innerHTML = '';
    let entries = [];
    try {
      entries = JSON.parse(localStorage.getItem('psico_mural') || '[]');
    } catch { return; }
    if (entries.length === 0) return;

    /* Mostrar hasta 12 dibujos distribuidos por el hero */
    const shown = entries.slice(0, 12);
    const cols = 4;
    const rows = 3;

    shown.forEach((entry, idx) => {
      const img = document.createElement('img');
      img.className = 'mural-ghost';
      img.src = entry.dataUrl;
      img.alt = '';
      img.draggable = false;

      /* Posición en rejilla con offset aleatorio para aspecto orgánico */
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const leftPct  = (col / cols) * 85 + 5 + (Math.random() * 8 - 4);
      const topPct   = (row / rows) * 72 + 8 + (Math.random() * 10 - 5);
      const rot      = (Math.random() * 16 - 8).toFixed(1);
      const delay    = (idx * 0.45 + Math.random() * 0.3).toFixed(2);
      const drawDur  = (1.4 + Math.random() * 1.0).toFixed(2);
      const w        = (18 + Math.random() * 10).toFixed(1); /* % width — bigger */

      img.style.cssText = `
        left: ${leftPct.toFixed(1)}%;
        top:  ${topPct.toFixed(1)}%;
        width: ${w}%;
        --rot: ${rot}deg;
        --delay: ${delay}s;
        --draw-dur: ${drawDur}s;
      `;

      bg.appendChild(img);
    });
  }

  populateMural();

  /* Re-poblar si el usuario guarda un nuevo dibujo durante la visita */
  window.addEventListener('storage', e => {
    if (e.key === 'psico_mural') populateMural();
  });
}

/* ════════════════════════════════════════════
   MODERACIÓN DE CONTENIDO (NSFW)
════════════════════════════════════════════ */
let _nsfwModel = null;

async function isContentSafe(canvas) {
  if (typeof nsfwjs === 'undefined') return true;
  try {
    if (!_nsfwModel) _nsfwModel = await nsfwjs.load();
    const predictions = await _nsfwModel.classify(canvas);
    const unsafeScore = predictions
      .filter(p => ['Porn', 'Hentai'].includes(p.className))
      .reduce((sum, p) => sum + p.probability, 0);
    return unsafeScore < 0.45;
  } catch {
    return true; /* en caso de error, permitir */
  }
}
