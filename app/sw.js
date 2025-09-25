const CACHE_NAME = "weget-cache-" + new Date().getTime();

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./app/manifest.json",
        "./app/installation.js",
        "./control/main.js",
        "./features/bg-changer.js",
        "./features/hide.js",
        "./style/main.css",
        "./images/icon.png"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return fetch(e.request)
        .then(fresh => {
          if (cached) {
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, fresh.clone()));
          }
          return fresh;
        })
        .catch(() => cached);
    })
  );
});

self.addEventListener("message", e => {
  if (e.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
