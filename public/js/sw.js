const CACHE_NAME = 'mon-pwa-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  // Ajoute ici les autres assets statiques (CSS, JS, images)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      });
    })
  );
});
