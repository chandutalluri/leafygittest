#!/usr/bin/env node

/**
 * Simple Production Start - No Build Required
 * Starts the unified gateway directly for testing
 */

const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting LeafyHealth Platform (Simple Mode)');
console.log('==============================================');

async function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.request({
      host: '127.0.0.1',
      port: port,
      timeout: 1000
    }, () => resolve(true));
    
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function startGateway() {
  try {
    console.log('🌐 Starting unified gateway on port 5000...');
    
    const gateway = spawn('node', ['server/unified-gateway-fixed.js'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    gateway.on('error', (error) => {
      console.error('❌ Gateway error:', error.message);
      process.exit(1);
    });

    // Wait a moment for startup
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if gateway is running
    const isRunning = await checkPort(5000);
    
    if (isRunning) {
      console.log('✅ Gateway started successfully!');
      console.log('🌐 Application available at: http://localhost:5000');
      console.log('');
      console.log('Available routes:');
      console.log('  • Customer: http://localhost:5000/customer');
      console.log('  • Super Admin: http://localhost:5000/superadmin');
      console.log('  • Admin Portal: http://localhost:5000/admin');
      console.log('  • Operations: http://localhost:5000/ops');
      console.log('');
      console.log('Press Ctrl+C to stop');
    } else {
      console.log('⚠️ Gateway may not be ready yet, but process is running');
      console.log('🔍 Check http://localhost:5000 in a few moments');
    }

    // Handle shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      gateway.kill('SIGTERM');
      setTimeout(() => {
        gateway.kill('SIGKILL');
        process.exit(0);
      }, 5000);
    });

    // Keep process alive
    process.stdin.resume();
    
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if server/unified-gateway-fixed.js exists');
    console.log('2. Verify no other process is using port 5000');
    console.log('3. Try: lsof -ti:5000 | xargs kill -9');
    process.exit(1);
  }
}

startGateway();