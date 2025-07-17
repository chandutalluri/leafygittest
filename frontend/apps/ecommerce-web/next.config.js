/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    // Disable heavy optimizations in development
    optimizeCss: process.env.NODE_ENV === 'production',
    optimizePackageImports: process.env.NODE_ENV === 'production' ? ['lucide-react', '@heroicons/react', 'framer-motion'] : [],
  },
  output: undefined,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Disable strict mode in development for faster restarts
  reactStrictMode: process.env.NODE_ENV === 'production',
  trailingSlash: false,
  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    domains: ['localhost', '127.0.0.1'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  allowedDevOrigins: [
    'https://f8f5cf53-9e11-4ffc-9b09-9006147cf921-00-3axzra1dcfeym.sisko.replit.dev',
    'https://f8f5cf53-9e11-4ffc-9b09-9006147cf921-00-3axzra1dcfeym.sisko.replit.dev:5000',
    '*.replit.dev',
    '*.replit.app'
  ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: http: https:; font-src 'self' data:; connect-src 'self' http://localhost:* ws://localhost:*;",
          },
        ],
      },
    ];
  },
  // All API requests are handled by Multi-App Gateway on port 5000
  // No rewrites needed as frontend is served through the gateway
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;