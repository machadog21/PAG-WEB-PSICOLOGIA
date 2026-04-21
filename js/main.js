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

  // Parallax interno + efecto pintura/acuarela sobre las fotos del equipo
  var photos = document.querySelectorAll('.main-team-card__photo');
  if (photos.length) {
    photos.forEach(function (photo) {
      var img = photo.querySelector('img');
      if (!img) return;
      var canvas = document.createElement('canvas');
      canvas.className = 'main-team-card__photo-paint';
      photo.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var offscreen = document.createElement('canvas');
      var offCtx = offscreen.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = 0, h = 0, ready = false, raf = 0, lastMove = 0;

      function renderMelted() {
        if (!img.naturalWidth) return false;
        offCtx.setTransform(1, 0, 0, 1, 0, 0);
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        offCtx.save();
        offCtx.filter = 'blur(18px) saturate(0.55) contrast(0.85)';
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var scale = Math.max(w / iw, h / ih) * 1.18;
        var dw = iw * scale, dh = ih * scale;
        offCtx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
        offCtx.restore();
        return true;
      }
      function paintFullMelted() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(offscreen, 0, 0, w, h);
      }
      function resize() {
        var r = photo.getBoundingClientRect();
        if (!r.width || !r.height) return;
        w = r.width; h = r.height;
        var cw = Math.round(w * dpr), ch = Math.round(h * dpr);
        canvas.width = cw; canvas.height = ch;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        offscreen.width = cw; offscreen.height = ch;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (renderMelted()) { paintFullMelted(); ready = true; }
      }
      function erode(x, y) {
        if (!ready) return;
        ctx.globalCompositeOperation = 'destination-out';
        var radius = Math.max(42, Math.min(w, h) * 0.24);
        var g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, 'rgba(0,0,0,0.55)');
        g.addColorStop(0.7, 'rgba(0,0,0,0.15)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        lastMove = Date.now();
        scheduleRefill();
      }
      function refillTick() {
        raf = 0;
        var since = Date.now() - lastMove;
        if (since > 200) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.035;
          ctx.drawImage(offscreen, 0, 0, w, h);
          ctx.globalAlpha = 1;
        }
        if (since < 4000) raf = requestAnimationFrame(refillTick);
      }
      function scheduleRefill() { if (!raf) raf = requestAnimationFrame(refillTick); }

      if (img.complete && img.naturalWidth) resize();
      else img.addEventListener('load', resize);
      photo.addEventListener('mousemove', function (e) {
        var r = photo.getBoundingClientRect();
        erode(e.clientX - r.left, e.clientY - r.top);
      });
      photo.addEventListener('mouseleave', function () { scheduleRefill(); });
      window.addEventListener('resize', resize);
    });

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

  // Mapa ortofoto de la consulta (Leaflet + Esri World Imagery)
  var mapEl = document.getElementById('contactMap');
  if (mapEl && window.L) {
    var consultaMap = window.L.map(mapEl, {
      center: [42.5987, -5.5671],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
    });
    window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles © Esri',
    }).addTo(consultaMap);
    if ('ResizeObserver' in window) {
      var mapRo = new ResizeObserver(function () { consultaMap.invalidateSize(); });
      mapRo.observe(mapEl);
    }
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

  // Terapias: todas visibles; el resaltado (.is-current) baja a medida que scrolleas
  var track = document.getElementById('servicesTrack');
  var stage = document.getElementById('servicesStage');
  if (track && stage) {
    var rows = Array.prototype.slice.call(track.children);
    var rowCount = rows.length;
    var carouselRaf = 0;
    var cachedRowHeight = 0;
    var cachedVh = 0;
    var currentIdx = -1;
    function measure() {
      cachedVh = window.innerHeight || 800;
      cachedRowHeight = rows[0].offsetHeight || (cachedVh * 0.32);
    }
    function updateCarousel() {
      carouselRaf = 0;
      var rect = stage.getBoundingClientRect();
      var vh = cachedVh;
      // Salir temprano si el stage está fuera del viewport
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      var travelable = rect.height - vh;
      if (travelable <= 0) return;
      var progress = -rect.top / travelable;
      if (progress < 0) progress = 0; else if (progress > 1) progress = 1;

      var rowHeight = cachedRowHeight;
      var pos = progress * (rowCount - 1);
      var translateY = (vh / 2) - (rowHeight / 2) - (pos * rowHeight);
      track.style.transform = 'translate3d(0,' + translateY.toFixed(1) + 'px,0)';

      var idx = Math.round(pos);
      if (idx < 0) idx = 0;
      else if (idx > rowCount - 1) idx = rowCount - 1;

      for (var i = 0; i < rowCount; i++) {
        var dist = i - pos;
        if (dist < 0) dist = -dist;
        var scale = 1 - dist * 0.22;
        if (scale < 0.45) scale = 0.45;
        var tx = dist * 18;
        if (tx > 48) tx = 48;
        var opacity = 1 - dist * 0.32;
        if (opacity < 0.15) opacity = 0.15;
        var s = rows[i].style;
        s.transform = 'translate3d(' + tx.toFixed(1) + 'vw,0,0) scale(' + scale.toFixed(3) + ')';
        s.opacity = opacity.toFixed(3);
      }
      if (idx !== currentIdx) {
        if (currentIdx >= 0) rows[currentIdx].classList.remove('is-current');
        rows[idx].classList.add('is-current');
        currentIdx = idx;
      }
    }
    function scheduleCarousel() {
      if (!carouselRaf) carouselRaf = requestAnimationFrame(updateCarousel);
    }
    window.addEventListener('scroll', scheduleCarousel, { passive: true });
    window.addEventListener('resize', function () { measure(); scheduleCarousel(); });
    measure();
    updateCarousel();
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
