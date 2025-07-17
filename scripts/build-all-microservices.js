#!/usr/bin/env node

/**
 * Build all NestJS microservices
 * This script compiles all microservices to ensure dist/main.js exists
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const microservices = [
  'identity-access',
  'user-role-management', 
  'company-management',
  'catalog-management',
  'inventory-management',
  'order-management',
  'payment-processing',
  'customer-service',
  'notification-service',
  'shipping-delivery',
  'employee-management',
  'accounting-management',
  'expense-monitoring',
  'analytics-reporting',
  'performance-monitor',
  'reporting-management',
  'content-management',
  'label-design',
  'multi-language-management',
  'marketplace-management',
  'subscription-management',
  'compliance-audit',
  'integration-hub',
  'product-orchestrator'
];

console.log('🔨 Building all microservices...\n');

let successCount = 0;
let failCount = 0;

for (const service of microservices) {
  const servicePath = path.join('backend/domains', service);
  
  if (!fs.existsSync(servicePath)) {
    console.log(`⚠️  ${service} - Directory not found, skipping...`);
    continue;
  }
  
  console.log(`📦 Building ${service}...`);
  
  try {
    // First install dependencies if needed
    if (!fs.existsSync(path.join(servicePath, 'node_modules'))) {
      console.log(`   Installing dependencies...`);
      execSync('npm install', { cwd: servicePath, stdio: 'pipe' });
    }
    
    // Build the service
    execSync('npm run build', { cwd: servicePath, stdio: 'pipe' });
    
    // Check if dist/main.js was created
    if (fs.existsSync(path.join(servicePath, 'dist/main.js'))) {
      console.log(`✅ ${service} - Build successful\n`);
      successCount++;
    } else {
      console.log(`⚠️  ${service} - Build completed but dist/main.js not found\n`);
      failCount++;
    }
  } catch (error) {
    console.error(`❌ ${service} - Build failed: ${error.message}\n`);
    failCount++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`📊 Build Summary: ${successCount} successful, ${failCount} failed`);
console.log('='.repeat(50));

if (successCount > 0) {
  console.log('\n✅ Microservices are ready to start!');
  console.log('Run: node scripts/start-all-microservices.js');
}