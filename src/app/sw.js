import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
clientsClaim();

self.addEventListener('push', (event) => {
    console.log('[SW] Push Received via Service Worker');

    let data;
    try {
        data = event.data ? event.data.json() : null;
    } catch (e) {
        console.error('[SW] JSON Parse Failed:', e);
        console.log('[SW] Raw data:', event.data.text());
        data = { title: 'Notification', body: event.data.text() };
    }

    if (!data) data = { title: 'New Event', body: 'test' };

    const options = {
        body: data.body,
        data: data,
        tag: data.tag || 'event',
        // icon: '/icons/icon-192x192.png', // Ensure this path exists!
        // badge: '/icons/badge-72x72.png'   // Ensure this path exists!
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(self.clients.openWindow(url));
});

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({ request, url }) =>
        request.destination === 'image' && url.pathname.startsWith('/assets/'),
    new CacheFirst({
        cacheName: 'asset-image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100, // Store up to 100 images
                maxAgeSeconds: 30 * 24 * 60 * 60, // Store for 30 days
                purgeOnQuotaError: true,
            }),
        ],
    })
);