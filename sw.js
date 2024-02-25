const staticCacheName = 's-app-v1';
const dynamicCacheName = 'd-app-v1';

const assetUrls = [
    'index.html',
    '/js/configStudents.js',
    '/js/dropdown-list.js',
    'students.json',
    '/css/menu-styles.css',
    '/css/nav-styles.css',
    '/css/students-styles.css',
    'offline.html',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => cache.addAll(assetUrls))
    );
});

self.addEventListener('activate', async (event) => {
    const cacheNames = await cache.keys();
    await Promise.all(
        cacheNames.filter(
            (name) => name !== staticCacheName && name !== dynamicCacheName
        )
    ).map((name) => cache.delete(name));
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    console.log(url);
    if (url.origin === location.origin) {
        // For static
        event.respondWith(cacheFirst(request));
    } else {
        // For other origin
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached ?? (await fetch(request));
}

async function networkFirst(request) {
    const cache = await cache.open(dynamicCacheName);
    try {
        const response = await fetch(request);
        await cache.put(response, response.clone());
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        return cached ?? cached.match('/offline.html');
    }
}
