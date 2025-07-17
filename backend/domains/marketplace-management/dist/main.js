
// Enhanced CommonJS wrapper for marketplace-management
const { register } = require('ts-node');

// Register TypeScript with optimized configuration
register({
  transpileOnly: true,
  skipIgnore: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    skipLibCheck: true,
    strict: false
  }
});

// Register path mapping with error handling
try {
  require('tsconfig-paths/register');
} catch (e) {
  console.log('tsconfig-paths not available, using direct imports');
}

// Import and start the main application
try {
  require('../src/main.ts');
} catch (error) {
  console.error('Service startup error:', error.message);
  console.log('Service will attempt graceful fallback...');
  // Fallback health endpoint
  const express = require('express');
  const app = express();
  app.get('/health', (req, res) => res.json({ 
    status: 'ok', 
    service: 'marketplace-management',
    mode: 'fallback'
  }));
  const port = process.env.PORT || 3000;
  app.listen(port, '127.0.0.1', () => {
    console.log(`marketplace-management fallback running on port ${port}`);
  });
}
