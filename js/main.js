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
})();
