/**
 * Shared Next.js configuration for all frontend applications
 * Ensures proper routing and API integration with centralized gateway
 */

/** @type {import('next').NextConfig} */
const baseConfig = {
  swcMinify: true,
  poweredByHeader: false,
  
  experimental: {
    externalDir: true,
    optimizeCss: true,
    optimizeServerReact: true
  },

  // Fix Replit Preview connection issues - UPDATED FOR CURRENT DOMAIN
  allowedDevOrigins: [
    '*.replit.dev',
    '*.picard.replit.dev',
    'https://3b5c9393-9663-4c10-8ef8-53fc19d9a848-00-2i5zv4zrv6kuz.picard.replit.dev:5000',
    'https://3b5c9393-9663-4c10-8ef8-53fc19d9a848-00-2i5zv4zrv6kuz.picard.replit.dev',
    'http://localhost:5000',
    'https://localhost:5000'
  ],
  
  // Fix WebSocket connections for HMR in proxy environment
  devIndicators: {
    buildActivity: false
  },
  
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  env: {
    GATEWAY_URL: process.env.GATEWAY_URL || '',
    API_BASE_URL: '/api'
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  output: 'standalone',
  compress: true,
  
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: false,
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
    // Disable PWA in development to prevent service worker errors
    pwa: {
      disable: true
    },
  }),
  
  ...(process.env.NODE_ENV === 'production' && {
    reactStrictMode: true,
    optimizeFonts: true,
  })
};

module.exports = baseConfig;