/* ═════════════════════════════════════════════════════
   MAIN-STYLE PSICOLOGÍA · interactividad
   - Navbar scroll state
   - Hero parallax con mouse
   - Scroll reveal (IntersectionObserver)
   - Year en footer
   ═════════════════════════════════════════════════════ */

(function () {
  // Year
  var y = document.getElementById('mainYear');
  if (y) y.textContent = new Date().getFullYear();

  // Sidemenu toggle (hamburguesa → panel lateral derecha→izquierda)
  var menuBtn = document.getElementById('menuToggle');
  var sideMenu = document.getElementById('mainMenu');
  var backdrop = document.getElementById('menuBackdrop');
  function setMenu(open) {
    if (!menuBtn || !sideMenu) return;
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    sideMenu.classList.toggle('is-open', open);
    sideMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (backdrop) {
      if (open) {
        backdrop.hidden = false;
        requestAnimationFrame(function () { backdrop.classList.add('is-open'); });
      } else {
        backdrop.classList.remove('is-open');
        setTimeout(function () { backdrop.hidden = true; }, 500);
      }
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!menuBtn.classList.contains('is-open'));
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
  var closeBtn = document.getElementById('menuClose');
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  if (sideMenu) {
    sideMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn && menuBtn.classList.contains('is-open')) setMenu(false);
  });

  // Navbar scroll state
  var nav = document.getElementById('mainNav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Parallax: capas del hero (con scroll + ratón) y capas ambient fijas (solo ratón)
  var layers = document.querySelectorAll('.main-layer');
  if (layers.length) {
    var heroLayers = [], fixedLayers = [], depthCache = [];
    layers.forEach(function (n) {
      var d = Number(n.getAttribute('data-depth') || 10);
      depthCache.push(d);
      if (n.classList.contains('main-layer--fixed')) fixedLayers.push({ n: n, d: d });
      else heroLayers.push({ n: n, d: d });
    });
    var mx = 0, my = 0, sy = 0, raf = 0, lastHeroOpacity = 1, lastAmbientOpacity = 0;
    function tick() {
      raf = 0;
      var vh = window.innerHeight || 800;
      var heroFade = (sy - vh * 0.2) / (vh * 0.5);
      if (heroFade < 0) heroFade = 0; else if (heroFade > 1) heroFade = 1;
      var heroOpacity = 1 - heroFade;
      var ambientFade = (sy - vh * 0.6) / (vh * 0.4);
      if (ambientFade < 0) ambientFade = 0; else if (ambientFade > 1) ambientFade = 1;
      var ambientOpacity = 0.55 * ambientFade;

      // Hero layers: saltar si ya están ocultas y no cambia la opacidad
      if (heroOpacity > 0.001 || lastHeroOpacity > 0.001) {
        for (var i = 0; i < heroLayers.length; i++) {
          var hl = heroLayers[i];
          var tx1 = -mx * hl.d;
          var ty1 = -my * hl.d - sy * hl.d * 0.012;
          var st = hl.n.style;
          st.transform = 'translate3d(' + tx1.toFixed(1) + 'px,' + ty1.toFixed(1) + 'px,0)';
          st.opacity = heroOpacity.toFixed(3);
        }
      }
      // Fixed ambient layers
      for (var j = 0; j < fixedLayers.length; j++) {
        var fl = fixedLayers[j];
        var tx2 = -mx * fl.d * 1.2;
        var ty2 = -my * fl.d * 1.2 - sy * fl.d * 0.02;
        var st2 = fl.n.style;
        st2.transform = 'translate3d(' + tx2.toFixed(1) + 'px,' + ty2.toFixed(1) + 'px,0)';
        st2.opacity = ambientOpacity.toFixed(3);
      }
      lastHeroOpacity = heroOpacity;
      lastAmbientOpacity = ambientOpacity;
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(tick); }
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      schedule();
    });
    window.addEventListener('scroll', function () {
      sy = window.scrollY;
      schedule();
    }, { passive: true });
    tick();
  }

  // Mural de la CTA: parallax suave con el ratón
  var muralEl = document.getElementById('ctaMural');
  if (muralEl) {
    var muralCards = muralEl.querySelectorAll('.main-mural__card');
    var baseRot = { casa: -2.2, cortinas: 1.4, pajaros: 2.8, ventana: -1.8 };
    var muralMx = 0, muralMy = 0, muralTmx = 0, muralTmy = 0, muralRaf = 0;
    function muralTick() {
      muralRaf = 0;
      muralMx += (muralTmx - muralMx) * 0.08;
      muralMy += (muralTmy - muralMy) * 0.08;
      for (var i = 0; i < muralCards.length; i++) {
        var c = muralCards[i];
        if (c.matches(':hover')) continue;
        var d = parseFloat(c.getAttribute('data-depth') || 10);
        var key = (c.className.match(/main-mural__card--(\w+)/) || [])[1] || '';
        var rot = baseRot[key] || 0;
        var tx = -muralMx * d;
        var ty = -muralMy * d * 0.6;
        c.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0) rotate(' + rot + 'deg)';
      }
      if (Math.abs(muralTmx - muralMx) > 0.002 || Math.abs(muralTmy - muralMy) > 0.002) {
        muralRaf = requestAnimationFrame(muralTick);
      }
    }
    muralEl.addEventListener('mousemove', function (e) {
      var r = muralEl.getBoundingClientRect();
      muralTmx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      muralTmy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      if (!muralRaf) muralRaf = requestAnimationFrame(muralTick);
    });
    muralEl.addEventListener('mouseleave', function () {
      muralTmx = 0; muralTmy = 0;
      if (!muralRaf) muralRaf = requestAnimationFrame(muralTick);
    });
  }

  // Parallax interno + efecto liquify/melt (SVG feTurbulence + feDisplacementMap) sobre las fotos del equipo
  var photos = document.querySelectorAll('.main-team-card__photo');
  if (photos.length) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var liquifySvg = document.createElementNS(svgNS, 'svg');
    liquifySvg.setAttribute('aria-hidden', 'true');
    liquifySvg.setAttribute('class', 'main-team-liquify-defs');
    var defs = document.createElementNS(svgNS, 'defs');
    liquifySvg.appendChild(defs);
    document.body.appendChild(liquifySvg);

    var liquifyStates = [];
    photos.forEach(function (photo, idx) {
      var imgs = photo.querySelectorAll('img');
      if (!imgs.length) return;
      var filterId = 'teamLiquify' + idx;
      var filter = document.createElementNS(svgNS, 'filter');
      filter.setAttribute('id', filterId);
      filter.setAttribute('x', '-20%');
      filter.setAttribute('y', '-20%');
      filter.setAttribute('width', '140%');
      filter.setAttribute('height', '140%');
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      var turb = document.createElementNS(svgNS, 'feTurbulence');
      turb.setAttribute('type', 'fractalNoise');
      turb.setAttribute('baseFrequency', '0.012 0.020');
      turb.setAttribute('numOctaves', '2');
      turb.setAttribute('seed', String(idx * 3 + 1));
      turb.setAttribute('result', 'turb');
      var disp = document.createElementNS(svgNS, 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'turb');
      disp.setAttribute('scale', '0');
      disp.setAttribute('xChannelSelector', 'R');
      disp.setAttribute('yChannelSelector', 'G');
      filter.appendChild(turb);
      filter.appendChild(disp);
      defs.appendChild(filter);

      for (var k = 0; k < imgs.length; k++) {
        imgs[k].style.filter = 'url(#' + filterId + ')';
      }

      var state = { turb: turb, disp: disp, current: 0, target: 0, seed: idx };
      liquifyStates.push(state);

      photo.addEventListener('mouseenter', function () { state.target = 40; });
      photo.addEventListener('mouseleave', function () { state.target = 0; });
    });

    if (!prefersReduced && liquifyStates.length) {
      var liquifyT0 = performance.now();
      (function tickLiquify(now) {
        var t = (now - liquifyT0) / 1000;
        for (var i = 0; i < liquifyStates.length; i++) {
          var s = liquifyStates[i];
          s.current += (s.target - s.current) * 0.08;
          s.disp.setAttribute('scale', s.current.toFixed(2));
          var fx = 0.010 + 0.006 * Math.sin(t * 0.55 + s.seed);
          var fy = 0.018 + 0.008 * Math.sin(t * 0.42 + s.seed * 1.3);
          s.turb.setAttribute('baseFrequency', fx.toFixed(4) + ' ' + fy.toFixed(4));
        }
        requestAnimationFrame(tickLiquify);
      })(liquifyT0);
    }

    var photosArr = Array.prototype.slice.call(photos);
    var photoRaf = 0;
    function photoTick() {
      photoRaf = 0;
      var vh = window.innerHeight || 800;
      for (var i = 0; i < photosArr.length; i++) {
        var el = photosArr[i];
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        var progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        if (progress < -1) progress = -1; else if (progress > 1) progress = 1;
        el.style.setProperty('--photo-parallax', (-progress * 60).toFixed(1) + 'px');
      }
    }
    function schedulePhoto() { if (!photoRaf) photoRaf = requestAnimationFrame(photoTick); }
    window.addEventListener('scroll', schedulePhoto, { passive: true });
    window.addEventListener('resize', schedulePhoto);
    photoTick();
  }

  // Hotspots de "Mi consulta": click → despliega/colapsa la tarjeta de cada punto
  var spotPills = document.querySelectorAll('.main-contact__spot-pill');
  if (spotPills.length) {
    spotPills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = pill.getAttribute('aria-expanded') === 'true';
        // cerrar los demás para mostrar solo uno a la vez
        spotPills.forEach(function (other) {
          if (other !== pill) other.setAttribute('aria-expanded', 'false');
        });
        pill.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });
    // Click fuera o tecla Escape → cerrar todos
    document.addEventListener('click', function (e) {
      if (e.target.closest('.main-contact__spot')) return;
      spotPills.forEach(function (p) { p.setAttribute('aria-expanded', 'false'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        spotPills.forEach(function (p) { p.setAttribute('aria-expanded', 'false'); });
      }
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.main-reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Terapias: pista vertical sticky; entrada alternada desde los laterales y crecimiento al centro
  var track = document.getElementById('servicesTrack');
  var stage = document.getElementById('servicesStage');
  if (track && stage) {
    var rows = Array.prototype.slice.call(track.children);
    var rowCount = rows.length;
    var cachedRowHeight = 0;
    var cachedVh = 0;
    var currentIdx = -1;
    var targetProgress = 0;
    var renderedProgress = 0;
    var loopRaf = 0;
    function measure() {
      cachedVh = window.innerHeight || 800;
      cachedRowHeight = rows[0].offsetHeight || (cachedVh * 0.32);
    }
    function computeTargetProgress() {
      var rect = stage.getBoundingClientRect();
      var travelable = rect.height - cachedVh;
      if (travelable <= 0) return 0;
      var p = -rect.top / travelable;
      if (p < 0) p = 0; else if (p > 1) p = 1;
      return p;
    }
    function paint(progress) {
      var rowHeight = cachedRowHeight;
      var pos = progress * (rowCount - 1);
      var translateY = (cachedVh / 2) - (rowHeight / 2) - (pos * rowHeight);
      track.style.transform = 'translate3d(0,' + translateY.toFixed(2) + 'px,0)';

      var idx = Math.round(pos);
      if (idx < 0) idx = 0; else if (idx > rowCount - 1) idx = rowCount - 1;

      for (var i = 0; i < rowCount; i++) {
        var signed = i - pos;
        var dist = signed < 0 ? -signed : signed;
        // Crecimiento al centro: 1.12 en foco, hasta 0.5 en los extremos
        var scale = 1.12 - dist * 0.32;
        if (scale < 0.5) scale = 0.5;
        // Entrada alternada desde los laterales: filas pares por la izquierda, impares por la derecha
        var dir = (i % 2 === 0) ? -1 : 1;
        var tx = dir * dist * dist * 14;
        if (tx > 90) tx = 90; else if (tx < -90) tx = -90;
        var opacity = 1 - dist * 0.34;
        if (opacity < 0.08) opacity = 0.08;
        var s = rows[i].style;
        s.transform = 'translate3d(' + tx.toFixed(2) + 'vw,0,0) scale(' + scale.toFixed(3) + ')';
        s.opacity = opacity.toFixed(3);
      }
      if (idx !== currentIdx) {
        if (currentIdx >= 0) rows[currentIdx].classList.remove('is-current');
        rows[idx].classList.add('is-current');
        currentIdx = idx;
      }
    }
    function loop() {
      var diff = targetProgress - renderedProgress;
      var absDiff = diff < 0 ? -diff : diff;
      if (absDiff < 0.0004) {
        renderedProgress = targetProgress;
        paint(renderedProgress);
        loopRaf = 0;
        return;
      }
      // Factor de suavizado: cuanto más bajo, más fluido (y con más arrastre)
      renderedProgress += diff * 0.14;
      paint(renderedProgress);
      loopRaf = requestAnimationFrame(loop);
    }
    function scheduleLoop() {
      var rect = stage.getBoundingClientRect();
      // No animar si el stage está fuera del viewport (ahorrar trabajo)
      if (rect.bottom < -cachedVh * 0.5 || rect.top > cachedVh * 1.5) {
        targetProgress = computeTargetProgress();
        renderedProgress = targetProgress;
        return;
      }
      targetProgress = computeTargetProgress();
      if (!loopRaf) loopRaf = requestAnimationFrame(loop);
    }
    window.addEventListener('scroll', scheduleLoop, { passive: true });
    window.addEventListener('resize', function () { measure(); scheduleLoop(); });
    measure();
    targetProgress = computeTargetProgress();
    renderedProgress = targetProgress;
    paint(renderedProgress);
  }

  // Servicios: click en fila → activa el texto de la derecha
  document.querySelectorAll('.main-service-row').forEach(function (row) {
    row.addEventListener('click', function () {
      var isActive = row.classList.toggle('is-active');
      row.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  });

  // Tarifas: toggle dinámico sesión ↔ bono (cambia precio y periodo)
  var priceToggle = document.querySelector('.main-pricing__toggle');
  if (priceToggle) {
    var btns = priceToggle.querySelectorAll('button[data-plan]');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var plan = btn.getAttribute('data-plan');
        btns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active);
        });
        priceToggle.setAttribute('data-plan', plan);

        document.querySelectorAll('.main-price-card__value').forEach(function (el) {
          var v = el.getAttribute('data-' + plan);
          if (v) {
            el.style.opacity = '0';
            setTimeout(function () { el.textContent = v; el.style.opacity = '1'; }, 180);
          }
        });
        document.querySelectorAll('.main-price-card__period').forEach(function (el) {
          var v = el.getAttribute('data-' + plan);
          if (v) {
            el.style.opacity = '0';
            setTimeout(function () { el.textContent = v; el.style.opacity = '1'; }, 180);
          }
        });
      });
    });
  }

  // Formulario de contacto: submit stub (sin backend, muestra el mensaje de éxito)
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var btn = form.querySelector('.main-form__submit');
      var success = form.querySelector('.main-form__success');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Enviando…';

      // Pequeño retardo para simular envío — sustituir por fetch a endpoint real
      setTimeout(function () {
        form.querySelectorAll('input, select, textarea, button').forEach(function (el) { el.disabled = true; });
        if (success) success.hidden = false;
        btn.querySelector('span').textContent = 'Enviado';
      }, 700);
    });
  }
})();
