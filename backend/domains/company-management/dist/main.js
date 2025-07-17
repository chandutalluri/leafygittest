
// Fixed CommonJS wrapper for company-management
const { register } = require('ts-node');

// Register TypeScript with proper configuration
register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  }
});

// Register path mapping
require('tsconfig-paths/register');

// Import and start the main application
require('../src/main.ts');
