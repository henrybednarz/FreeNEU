import pwa from '@ducanh2912/next-pwa';

const withPWA = pwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
    sw: 'sw.js',
    swSrc: 'app/sw.js'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);