const CACHE_NAME = 'mini-labs-v1';
const STATIC_ASSETS = [
  '/',
  '/json',
  '/base64',
  '/regex',
  '/word-counter',
  '/color-picker',
  '/hex-rgb',
  '/palette-generator',
  '/timestamp',
  '/countdown',
  '/timezone',
  '/password-generator',
  '/case-converter',
  '/url-encoder',
  '/qr-generator',
  '/image-base64',
  '/json-csv',
];

// Install: pre-cache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
