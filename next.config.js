/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  
  // Image optimization
  images: {
    domains: ['avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Production optimizations
  poweredByHeader: false,
}

module.exports = nextConfig
