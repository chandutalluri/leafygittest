/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === 'production',
  basePath: '/superadmin',
  experimental: {
    externalDir: true,
    // Development optimizations for faster restarts
    optimizeCss: process.env.NODE_ENV === 'production',
  },
  
  // Fast refresh settings for development
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 2,
    },
  }),
  
  // Fix webpack ESM compilation issues with Radix UI
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };
    
    // Handle ESM modules properly
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    return config;
  },
  
  // Transpile ESM packages
  transpilePackages: [
    '@radix-ui/react-id',
    '@radix-ui/react-dialog',
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-avatar',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-label',
    '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-toggle',
    '@radix-ui/react-tooltip'
  ],
  
  // Fix cross-origin warning for Replit domains
  allowedDevOrigins: [
    '127.0.0.1:5000',
    'localhost:5000',
    '127.0.0.1',
    'localhost',
    '3b5c9393-9663-4c10-8ef8-53fc19d9a848-00-2i5zv4zrv6kuz.picard.replit.dev:5000',
    '3b5c9393-9663-4c10-8ef8-53fc19d9a848-00-2i5zv4zrv6kuz.picard.replit.dev'
  ],

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'development',
  },

  // ESLint configuration
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true, // Allow build to continue with warnings
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Image configuration
  images: {
    unoptimized: true, // Disable Next.js image optimization for backend-served images
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/image-management/**',
      },
      {
        protocol: 'https',
        hostname: '*.replit.dev',
        pathname: '/api/image-management/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;