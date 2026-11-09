/* meow 生活 — service worker（v0.9.3）
   缓存策略（2026-11-09 修：旧版 cache-first 把页面也缓存死了，
   CACHE_NAME 又一直停在 v0.9.0 没跟着版号走，导致新版推上去后
   浏览器还拿旧缓存，横幅出不来、页脚还是旧链接）：
   - HTML（页面导航）：network-first，永远先问服务器拿最新版，
     离线时才回退到缓存。这样推新版后刷新就是新版，不会被旧缓存卡住。
   - 静态资源（JS／CSS／图片，文件名带内容 hash，内容变文件名就变）：
     cache-first，安全又省流量。
   - CACHE_NAME 跟着 package.json 版号走，发新版时一起改，
     activate 会清掉旧缓存。 */

const CACHE_NAME = 'cat-planet-v0.9.3';
const PRECACHE = [
  '/story.html',
  '/stories.html',
  '/cats.html',
  '/season.html',
  '/oneko.gif',
  '/illustrations/hero-cat-house.webp',
  '/illustrations/cat-mother-youhu.webp',
  '/illustrations/kittens-playing.webp',
  '/manifest.webmanifest',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // 只管同站 GET，其他一律放行。
  if (request.method !== 'GET') return;
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;

  // HTML 页面（含导航）：network-first，永远拿最新版，离线才用缓存。
  const isHTML =
    request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html');
  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // 静态资源：cache-first（文件名带 hash，内容变文件名就变，不会 stale）。
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // 只缓存成功的同站响应。
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
