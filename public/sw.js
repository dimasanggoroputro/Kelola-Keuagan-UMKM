const STATIC_CACHE_NAME = "catetin-static-v2";
const PAGE_CACHE_NAME = "catetin-pages-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
];

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === "basic") {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return caches.match("/");
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === "basic") {
      const cache = await caches.open(PAGE_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match("/");
  }
}

// Install Event: cache static shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Activate Event: clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== PAGE_CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch Event: respond using navigation-first for pages and cache-first for assets
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const request = event.request;
  const isNavigation =
    request.mode === "navigate" || request.destination === "document";
  const isStaticAsset = [
    "style",
    "script",
    "image",
    "font",
    "manifest",
    "audio",
    "video",
  ].includes(request.destination);

  if (isNavigation) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset || ASSETS_TO_CACHE.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
