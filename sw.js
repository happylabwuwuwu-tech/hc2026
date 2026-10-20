const CACHE_NAME = 'hc2026-presenter-v4';
const ASSETS = [
  './',
  './index.html',
  './HealthCom_presenter.html',
  './poster.html',
  './poster_assets/poster_2400.jpg',
  './poster_assets/step1_intro.jpg',
  './poster_assets/step2_background.jpg',
  './poster_assets/step3_features.jpg',
  './poster_assets/step4_workflow.jpg',
  './poster_assets/step5_evaluation.jpg',
  './poster_assets/step6_conclusion.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
