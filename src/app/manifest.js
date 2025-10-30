export default function manifest() {
    return {
        name: 'FreeNEU PWA',
        short_name: 'FreeNEU',
        description: 'NEU Freebies Tracker ',
        start_url: '/?source=pwa',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            // {
            //     src: '/icon-192x192.png',
            //     sizes: '192x192',
            //     type: 'image/png',
            // },
            // {
            //     src: '/icon-512x512.png',
            //     sizes: '512x512',
            //     type: 'image/png',
            // },
        ],
    }
}