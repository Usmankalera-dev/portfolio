/* v49 premium animations — Usman Kalera portfolio
   Staggered per-element reveals, animated skill bars, subtle 3D card tilt.
   Graceful: if this file or IntersectionObserver is missing, nothing hides. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  /* ---- staggered reveals ---- */
  var targets = [];
  document.querySelectorAll('.section h2').forEach(function (h) { targets.push(h); });
  ['.cards', '.timeline', '.steps', '.pricing-grid'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty('--d', Math.min(i, 6) * 0.09 + 's');
        targets.push(child);
      });
    });
  });
  // standalone blocks that also deserve a reveal
  document.querySelectorAll('.section .lead, .section .more, .venture-card, .rating-summary, .faq-item, .contact-grid, .book-card')
    .forEach(function (el) { if (targets.indexOf(el) === -1) targets.push(el); });

  targets.forEach(function (el) { el.classList.add('rv'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
  targets.forEach(function (el) { io.observe(el); });

  /* ---- animated skill bars: 0 -> target % when visible ---- */
  var bars = document.querySelectorAll('.bar i');
  bars.forEach(function (b) {
    b.setAttribute('data-w', b.style.width || '0%');
    b.style.width = '0%';
  });
  var bio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.width = e.target.getAttribute('data-w');
        bio.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(function (b) { bio.observe(b); });

  /* ---- subtle 3D tilt on cards (fine pointers only) ---- */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.cards .card, .price-card').forEach(function (card) {
      card.classList.add('tilt');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        card.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }
})();
