// Minimal service worker for caching static assets (optional)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('tvk-cache-v1')
      .then((cache) =>
        cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/script.js',
          '/supabase-config.js',
          '/images/tvk-logo.svg',
        ])
      )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
