const CACHE_NAME = "hskgo-cache-v1";
const urlsToCache = [
  "index.html",
  "style.css",
  "script.js",
  "data.js",
  "HSKGo_192x192.png",
  "HSKGo_512x512.png",
  "HSKSamy_entete.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
