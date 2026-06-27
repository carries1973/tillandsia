// Tillandsia service worker — Phase 0 shell cache.
// (Web Push lands in Phase 2B; the registration just needs to exist now.)
const CACHE = 'tillandsia-shell-v1';
const SHELL = ['/home', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for navigations (always try fresh data; fall back to cached shell offline).
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/home').then((r) => r || Response.error()))
    );
  }
});
