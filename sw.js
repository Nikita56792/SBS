/* Minimal service worker: network-first, cache fallback.
 * Makes the page installable as a PWA on mobile devices. */
const CACHE = "sbs-promo-v7";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("sbs-promo-") && key !== CACHE)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // APKs must always come from the server, never an old offline cache.
  if (request.method !== "GET" || url.origin !== self.location.origin ||
      url.pathname.endsWith(".apk")) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches
          .open(CACHE)
          .then((cache) => cache.put(request, copy))
          .catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || Response.error())
      )
  );
});
