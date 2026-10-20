/* Usman Kalera portfolio — service worker (v50)
   Static shell cache: repeat visits load instantly and the page shell
   survives flaky connections. HTML is network-first (always fresh when
   online); API/backend traffic is never touched. */
var CACHE = 'uk-portfolio-v55';
var CORE = [
  'index.html',
  'styles.css?v=49',
  'app.js?v=55',
  'anim.js?v=49',
  'bg3d.js?v=48',
  'assets/photo.jpg',
  'assets/logo.png',
  'assets/Usman-Kalera-CV.pdf'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(CORE); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () {})
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // backend/CDN: pass through

  if (e.request.mode === 'navigate') {
    // network-first for pages, cache fallback when offline
    e.respondWith(
      fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put('index.html', copy); });
        return r;
      }).catch(function () { return caches.match('index.html'); })
    );
    return;
  }

  // cache-first for same-origin static assets, fill cache on first fetch
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return r;
      });
    })
  );
});
