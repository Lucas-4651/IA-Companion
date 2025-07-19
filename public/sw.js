const CACHE_NAME = 'IA-Comp v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/app.js',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si en cache → retourne, sinon réseau
        if (response) return response;
        return fetch(event.request)
          .catch(() => caches.match('/offline.html'));
      })
  );
});
