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
  
  output: undefined,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  allowedDevOrigins: [
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