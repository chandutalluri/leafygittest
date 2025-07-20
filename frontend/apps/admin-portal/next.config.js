/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    // Development optimizations for faster restarts
    optimizeCss: process.env.NODE_ENV === 'production',
  },
  // Faster development builds
  reactStrictMode: process.env.NODE_ENV === 'production',
  
  // Fast refresh settings for development
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 2,
    },
  }),
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  allowedDevOrigins: [
    'https://f8f5cf53-9e11-4ffc-9b09-9006147cf921-00-3axzra1dcfeym.sisko.replit.dev',
    'https://f8f5cf53-9e11-4ffc-9b09-9006147cf921-00-3axzra1dcfeym.sisko.replit.dev:5000',
    '*.replit.dev',
    '*.replit.app'
  ],
  images: {
    domains: ['localhost', 'api.leafyhealth.local'],
    unoptimized: true,
  },
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Allow build to continue with warnings
  },
}

module.exports = nextConfig