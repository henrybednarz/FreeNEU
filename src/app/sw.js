import { defaultCache } from "@serwist/next/worker";
import { installSerwist } from "@serwist/sw";

const customRuntimeCaching = [
    {
        urlPattern: ({ request, url }) => request.destination === 'image' && url.pathname.startsWith('/assets/'),
        handler: 'CacheFirst',
        options: {
            cacheName: 'icon-assets',
            expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            },
        },
    },
    ...defaultCache,
];

installSerwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: customRuntimeCaching,
});

// 1. Push Notifications
self.addEventListener('push', (event) => {
    let data;
    try {
        data = event.data.json();
    } catch (e) {
        // Fallback for non-JSON payloads
        data = { title: 'FreeNEU', body: event.data.text() };
    }

    const options = {
        body: data.body,
        icon: '/assets/blue_icon.png', // Default icon
        badge: '/assets/blue_icon.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});