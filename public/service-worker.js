self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'New event', body: '' };
    const options = { body: data.body, data: data, tag: data.tag || 'event' };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
});