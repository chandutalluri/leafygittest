#!/usr/bin/env node

/**
 * Fix npm dependencies and install with legacy peer deps
 * Resolves eslint-config-airbnb peer dependency conflicts
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing npm dependencies...');

try {
  // Clear npm cache
  console.log('📦 Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // Remove node_modules and package-lock.json
  console.log('🗑️ Removing node_modules and lock file...');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
  if (fs.existsSync('package-lock.json')) {
    execSync('rm -f package-lock.json', { stdio: 'inherit' });
  }
  
  // Install with legacy peer deps to resolve conflicts
  console.log('📥 Installing dependencies with legacy peer deps...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('✅ Dependencies fixed successfully!');
  console.log('💡 You can now run: node build-and-run.js');
  
} catch (error) {
  console.error('❌ Error fixing dependencies:', error.message);
  console.log('\n🔧 Manual fix:');
  console.log('1. Run: rm -rf node_modules package-lock.json');
  console.log('2. Run: npm install --legacy-peer-deps');
  console.log('3. Then: node build-and-run.js');
  process.exit(1);
}