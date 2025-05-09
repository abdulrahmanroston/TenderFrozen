self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open('tenderfrozen-cache-v1')
    .then((cache) => {
      return cache.addAll([
        'https://abdulrahmanroston.github.io/TenderFrozen/',
        'https://abdulrahmanroston.github.io/TenderFrozen/index.html',
        'https://abdulrahmanroston.github.io/TenderFrozen/pos.html',
        'https://abdulrahmanroston.github.io/TenderFrozen/products.html',
        'https://abdulrahmanroston.github.io/TenderFrozen/tf-navigation.js',
        'https://abdulrahmanroston.github.io/TenderFrozen/icons/icon1.png',
        'https://abdulrahmanroston.github.io/TenderFrozen/icons/icon2.png',
        'https://abdulrahmanroston.github.io/TenderFrozen/icons/icon1.png'
      ]).then(() => {
        console.log('Service Worker: Cached all files successfully');
      }).catch((error) => {
        console.error('Service Worker: Cache failed:', error);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = ['tenderfrozen-cache-v1'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('Service Worker: Activated and old caches cleaned');
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return caches.open('tenderfrozen-cache-v1').then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch((error) => {
      console.error('Service Worker: Fetch failed:', error);
    })
  );
});