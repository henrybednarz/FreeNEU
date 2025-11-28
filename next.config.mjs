import withSerwistInit from "@serwist/next";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withSerwist = withSerwistInit({
    swSrc: path.join(__dirname, 'src/app/sw.js'),
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',
    exclude: [
        /marker-icon.*?\.png$/,
        /marker-shadow.*?\.png$/
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withSerwist(nextConfig);