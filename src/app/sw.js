import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

// 1. WORKBOX: PRECACHING
// This placeholder will be replaced by the next-pwa plugin
// with a list of all your Next.js assets (pages, chunks, icons, etc.)
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'New event', body: '' };
    const options = { body: data.body, data: data, tag: data.tag || 'event' };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(self.clients.openWindow(url));
});