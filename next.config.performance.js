/**
 * Performance optimized Next.js configuration
 * Shared across all frontend applications
 */

module.exports = {
  // Enable production optimizations
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: ['localhost', '127.0.0.1'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization.minimize = true;
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    
    // Reduce bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash': 'lodash-es',
    };
    
    return config;
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'framer-motion'],
  },
  
  // Compress assets
  compress: true,
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Optimize fonts
  optimizeFonts: true,
};