#!/usr/bin/env node

/**
 * Gateway-Only Start Script
 * Starts just the unified gateway without frontend apps
 */

const { spawn } = require('child_process');

console.log('🚀 LeafyHealth Gateway-Only Mode');
console.log('==================================');
console.log('Starting unified gateway on port 5000...');
console.log('All API endpoints will be available through the gateway.');
console.log('');

const gateway = spawn('node', ['server/unified-gateway-fixed.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

gateway.on('error', (error) => {
  console.error('❌ Gateway error:', error.message);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gateway...');
  gateway.kill('SIGTERM');
  setTimeout(() => {
    gateway.kill('SIGKILL');
    process.exit(0);
  }, 3000);
});

console.log('🌐 Gateway will be available at: http://localhost:5000');
console.log('🔧 API endpoints: http://localhost:5000/api/*');
console.log('❤️ Health check: http://localhost:5000/health');
console.log('');
console.log('Press Ctrl+C to stop');

// Keep process alive
process.stdin.resume();