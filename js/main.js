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

  // Hero parallax
  var scene = document.getElementById('heroScene');
  if (scene) {
    var layers = scene.querySelectorAll('.main-layer');
    var mx = 0, my = 0, raf = 0;
    function tick() {
      raf = 0;
      layers.forEach(function (n) {
        var d = Number(n.getAttribute('data-depth') || 10);
        n.style.transform = 'translate3d(' + (-mx * d).toFixed(1) + 'px,' + (-my * d).toFixed(1) + 'px,0)';
      });
    }
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
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

  // Servicios: click en fila → activa el texto de la derecha (el hover hace el stretch)
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
