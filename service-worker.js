const CACHE_NAME = "hskgo-cache-v2"; // incrémente la version à chaque changement
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/data.js",
  "/HSKGo_192x192.png",
  "/HSKGo_512x512.png",
  "/HSKSamy_entete.png"
];

const IMAGES_CACHE = "hskgo-images-v1";
const FALLBACK_IMAGE = "/HSKGo_192x192.png"; // change si tu as une image dédiée de fallback

// Pré-cache des assets statiques
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Nettoyage des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== IMAGES_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Routing et stratégies de cache
self.addEventListener("fetch", event => {
  const request = event.request;

  // Images: cache dynamique (cache-first, puis réseau, avec fallback)
  if (request.destination === "image" || request.url.includes("/images/")) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request)
            .then(networkResponse => {
              // Mise en cache seulement si succès
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => caches.match(FALLBACK_IMAGE));
        })
      )
    );
    return;
  }

  // HTML: network-first pour toujours avoir la dernière version (avec fallback cache)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Autres fichiers (CSS, JS, JSON): cache-first, puis réseau
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
