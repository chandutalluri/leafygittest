/**
 * Development-optimized Next.js configuration
 * Optimizes for fast restarts and hot reloading
 */

/** @type {import('next').NextConfig} */
const devConfig = {
  // Essential development optimizations
  swcMinify: false, // Disable in development for faster builds
  poweredByHeader: false,
  
  experimental: {
    externalDir: true,
    optimizeCss: false, // Disable CSS optimization in dev
    optimizeServerReact: false // Disable server optimization in dev
  },

  // Fast refresh optimizations
  reactStrictMode: false, // Disable strict mode for faster development
  
  // Minimize build time in development
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // Reduce inactive page cache time
    pagesBufferLength: 2, // Reduce buffer for faster restarts
  },
  
  // Development-specific webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Faster development builds
      config.optimization.minimize = false;
      config.optimization.splitChunks = false;
      
      // Reduce module resolution time
      config.resolve.symlinks = false;
      config.resolve.cacheWithContext = false;
      
      // Speed up file watching
      config.watchOptions = {
        poll: false,
        ignored: /node_modules/,
      };
    }
    
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
  
  // Fast image loading in development
  images: {
    domains: ['localhost', '127.0.0.1'],
    unoptimized: true, // Skip image optimization in dev
  },
  
  // Disable dev indicators for faster UI
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  
  // Environment variables
  env: {
    GATEWAY_URL: process.env.GATEWAY_URL || '',
    API_BASE_URL: '/api'
  },
  
  // Skip compression in development
  compress: false,
  
  // Replit-specific configurations
  allowedDevOrigins: [
    '*.replit.dev',
    '*.riker.replit.dev',
    'http://localhost:5000',
    'https://localhost:5000'
  ],
};

module.exports = devConfig;