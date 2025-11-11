import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
clientsClaim();

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

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'New Event', body: '' };
    const options = { body: data.body, data: data, tag: data.tag || 'event' };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(self.clients.openWindow(url));
});