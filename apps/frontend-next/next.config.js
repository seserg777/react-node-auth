/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Optimize images
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;

