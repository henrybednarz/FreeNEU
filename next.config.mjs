import pwa from '@ducanh2912/next-pwa';

const withPWA = pwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
    sw: 'sw.js',
    swSrc: './src/app/sw.js',
    buildExcludes: [
        /marker-icon.*\.png$/,
        /marker-shadow.*\.png$/
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);