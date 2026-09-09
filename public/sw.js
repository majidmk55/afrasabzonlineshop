// Service Worker برای افرالیک - فروشگاه تخصصی لپ‌تاپ
// نسخه: 1.0.0
// آخرین به‌روزرسانی: 2026-01-22

const CACHE_NAME = 'corehaus-cache-v1';
const STATIC_CACHE = 'corehaus-static-v1';
const DYNAMIC_CACHE = 'corehaus-dynamic-v1';

// فایل‌های استاتیک برای cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  // فونت‌ها
  'https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Markazi+Text:wght@400;500;600;700&display=swap',
];

// نصب Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتژی Cache First برای فایل‌های استاتیک
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // فقط برای درخواست‌های GET
  if (request.method !== 'GET') return;

  // استراتژی Cache First برای فایل‌های استاتیک
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // استراتژی Network First برای API و صفحات
  if (isAPIRequest(url) || isPageRequest(url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // استراتژی Stale While Revalidate برای تصاویر
  if (isImageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // استراتژی پیش‌فرض: Network First
  event.respondWith(networkFirst(request));
});

// بررسی نوع درخواست
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname === asset || url.href.includes(asset));
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isPageRequest(url) {
  return url.pathname === '/' || 
         url.pathname.startsWith('/laptop/') ||
         url.pathname.startsWith('/category/') ||
         url.pathname.startsWith('/brand/') ||
         url.pathname.startsWith('/compare/') ||
         url.pathname.startsWith('/blog/');
}

function isImageRequest(url) {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i) ||
         url.hostname.includes('image.qwenlm.ai') ||
         url.hostname.includes('cdn.simpleicons.org');
}

// استراتژی Cache First
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// استراتژی Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// استراتژی Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.error('[Service Worker] Stale while revalidate failed:', error);
    return cachedResponse || new Response('Offline', { status: 503 });
  });
  
  return cachedResponse || fetchPromise;
}

// پاک‌سازی cache قدیمی
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    });
  }
});

// Background Sync برای عملیات offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  // پیاده‌سازی sync برای سبد خرید
  console.log('[Service Worker] Syncing cart...');
}

// Push Notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event.notification.tag);
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Loaded');
