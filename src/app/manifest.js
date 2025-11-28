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
            {
                src: '/assets/blue_icon.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
            {
                src: '/assets/green_icon.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
            {
                src: '/assets/orange_icon.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
            {
                src: '/assets/person-icon.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
            {
                src: '/assets/purple_icon.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
            {
                src: '/assets/red_icon.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
        ],
    }
}