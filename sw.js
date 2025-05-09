const CACHE_NAME = 'tenderfrozen-cache-v1';
const urlsToCache = [
  'https://abdulrahmanroston.github.io/TenderFrozen/',
  'https://abdulrahmanroston.github.io/TenderFrozen/pos.html',
  'https://abdulrahmanroston.github.io/TenderFrozen/products.html',
  'https://abdulrahmanroston.github.io/TenderFrozen/tf-navigation.css',
  'https://abdulrahmanroston.github.io/TenderFrozen/tf-navigation.js',
  'https://abdulrahmanroston.github.io/TenderFrozen/icons/icon-192.png',
  'https://abdulrahmanroston.github.io/TenderFrozen/icons/icon-512.png',
  'https://abdulrahmanroston.github.io/TenderFrozen/icons/icon-maskable.png'
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
    .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});