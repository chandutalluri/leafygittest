#!/usr/bin/env node

/**
 * Quick Start Script for Ubuntu VPS
 * Handles dependency issues and starts the application
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 LeafyHealth Quick Start for Ubuntu VPS');
console.log('==========================================');

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n📋 ${description}...`);
    console.log(`💻 ${command}`);
    
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ ${description} failed: ${error.message}`);
        reject(error);
      } else {
        console.log(`✅ ${description} completed`);
        resolve();
      }
    });
    
    child.stdout.on('data', (data) => console.log(data.toString().trim()));
    child.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('WARN')) {
        console.log(output);
      }
    });
  });
}

async function startGateway() {
  return new Promise((resolve) => {
    console.log('\n🌐 Starting Unified Gateway...');
    
    const gateway = spawn('node', ['server/unified-gateway-fixed.js'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    gateway.on('error', (error) => {
      console.log(`❌ Gateway error: ${error.message}`);
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      gateway.kill('SIGTERM');
      setTimeout(() => {
        gateway.kill('SIGKILL');
        process.exit(0);
      }, 5000);
    });

    console.log('🌐 Gateway starting... Check http://localhost:5000 in a moment');
    resolve();
  });
}

async function main() {
  try {
    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      console.log('📦 Installing dependencies with legacy peer deps...');
      await runCommand('npm install --legacy-peer-deps', 'Installing dependencies');
    } else {
      console.log('📦 Dependencies already installed');
    }

    // Check if gateway file exists
    if (!fs.existsSync('server/unified-gateway-fixed.js')) {
      throw new Error('Gateway file not found. Please ensure server/unified-gateway-fixed.js exists.');
    }

    // Start the gateway
    console.log('\n🎯 Starting LeafyHealth Platform...');
    console.log('🌐 Application will be available at: http://localhost:5000');
    console.log('📱 Available routes:');
    console.log('   • Super Admin: http://localhost:5000/');
    console.log('   • Customer: http://localhost:5000/customer');
    console.log('   • Admin: http://localhost:5000/admin');
    console.log('   • Operations: http://localhost:5000/ops');
    console.log('\nPress Ctrl+C to stop\n');

    await startGateway();

  } catch (error) {
    console.log(`\n❌ Quick start failed: ${error.message}`);
    console.log('\n🔧 Manual steps:');
    console.log('1. rm -rf node_modules package-lock.json');
    console.log('2. npm install --legacy-peer-deps');
    console.log('3. node server/unified-gateway-fixed.js');
    process.exit(1);
  }
}

main();