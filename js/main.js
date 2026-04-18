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
    var mx = 0, my = 0, sy = 0, raf = 0;
    function tick() {
      raf = 0;
      var vh = window.innerHeight || 800;
      // Fade del hero: comienza a los 20% de viewport y termina a los 70% para esconderse antes del 2º grupo
      var heroFade = Math.max(0, Math.min(1, (sy - vh * 0.2) / (vh * 0.5)));
      var heroOpacity = 1 - heroFade;
      var ambientFade = Math.max(0, Math.min(1, (sy - vh * 0.6) / (vh * 0.4)));
      layers.forEach(function (n) {
        var d = Number(n.getAttribute('data-depth') || 10);
        var isFixed = n.classList.contains('main-layer--fixed');
        var tx = -mx * d * (isFixed ? 1.2 : 1);
        var ty = -my * d * (isFixed ? 1.2 : 1) + sy * (d * (isFixed ? 0.02 : 0.012));
        n.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
        if (isFixed) {
          n.style.opacity = (0.55 * ambientFade).toFixed(3);
        } else {
          n.style.opacity = heroOpacity.toFixed(3);
        }
      });
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
    function updateCarousel() {
      carouselRaf = 0;
      var rect = stage.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var travelable = rect.height - vh;
      if (travelable <= 0) return;
      var progress = -rect.top / travelable;
      progress = Math.max(0, Math.min(1, progress));

      // Niika style escalonado: la activa ocupa el centro a tamaño pleno,
      // las vecinas se encogen y se retiran hacia la derecha cuanto más lejos estén
      var rowHeight = rows[0].offsetHeight || (vh * 0.45);
      var pos = progress * (rowCount - 1);
      var translateY = (vh / 2) - (rowHeight / 2) - (pos * rowHeight);
      track.style.transform = 'translate3d(0,' + translateY.toFixed(1) + 'px,0)';

      var idx = Math.round(pos);
      if (idx < 0) idx = 0;
      if (idx > rowCount - 1) idx = rowCount - 1;

      for (var i = 0; i < rowCount; i++) {
        var dist = Math.abs(i - pos);
        var scale = Math.max(0.45, 1 - dist * 0.22);
        var tx = Math.min(48, dist * 18); // vw — se esconden hacia la derecha
        var opacity = Math.max(0.15, 1 - dist * 0.32);
        rows[i].style.transform = 'translate3d(' + tx.toFixed(1) + 'vw,0,0) scale(' + scale.toFixed(3) + ')';
        rows[i].style.opacity = opacity.toFixed(3);
        rows[i].classList.toggle('is-current', i === idx);
      }
    }
    function scheduleCarousel() {
      if (!carouselRaf) carouselRaf = requestAnimationFrame(updateCarousel);
    }
    window.addEventListener('scroll', scheduleCarousel, { passive: true });
    window.addEventListener('resize', scheduleCarousel);
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
