#!/usr/bin/env node

/**
 * CRITICAL SECURITY FIX - LOCALHOST BINDING ENFORCEMENT
 * Forces all microservices to bind ONLY to localhost (127.0.0.1)
 * Fixes the 0.0.0.0 binding issue seen in network table
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 FIXING LOCALHOST BINDING FOR ALL SERVICES');
console.log('============================================\n');

// Fix all NestJS services that might have environment overrides
const nestServices = [
  'backend/domains/identity-access/src/main.ts',
  'backend/domains/user-role-management/src/main.ts', 
  'backend/domains/company-management/src/main.ts',
  'backend/domains/catalog-management/src/main.ts',
  'backend/domains/inventory-management/src/main.ts',
  'backend/domains/order-management/src/main.ts',
  'backend/domains/payment-processing/src/main.ts',
  'backend/domains/customer-service/src/main.ts',
  'backend/domains/notification-service/src/main.ts',
  'backend/domains/shipping-delivery/src/main.ts',
  'backend/domains/employee-management/src/main.ts',
  'backend/domains/accounting-management/src/main.ts',
  'backend/domains/expense-monitoring/src/main.ts',
  'backend/domains/analytics-reporting/src/main.ts',
  'backend/domains/performance-monitor/src/main.ts',
  'backend/domains/reporting-management/src/main.ts',
  'backend/domains/content-management/src/main.ts',
  'backend/domains/label-design/src/main.ts',
  'backend/domains/multi-language-management/src/main.ts',
  'backend/domains/marketplace-management/src/main.ts',
  'backend/domains/subscription-management/src/main.ts',
  'backend/domains/compliance-audit/src/main.ts',
  'backend/domains/integration-hub/src/main.ts',
  'backend/domains/image-management/src/main.ts',
  'backend/domains/product-orchestrator/src/main.ts',
  'backend/domains/database-backup-restore/src/main.ts',
];

let fixedCount = 0;

nestServices.forEach(servicePath => {
  if (fs.existsSync(servicePath)) {
    let content = fs.readFileSync(servicePath, 'utf8');
    
    // Ensure strict localhost binding with environment fallback protection
    const patterns = [
      // Fix any listen calls that don't specify host
      {
        from: /await app\.listen\(port\);/g,
        to: "await app.listen(port, '127.0.0.1');"
      },
      // Fix any listen calls with environment variable host
      {
        from: /await app\.listen\(port, process\.env\.HOST.*?\);/g,
        to: "await app.listen(port, '127.0.0.1');"
      },
      // Fix any 0.0.0.0 bindings
      {
        from: /await app\.listen\(port, '0\.0\.0\.0'\);/g,
        to: "await app.listen(port, '127.0.0.1');"
      },
      // Fix any undefined host bindings
      {
        from: /await app\.listen\(port, undefined\);/g,
        to: "await app.listen(port, '127.0.0.1');"
      }
    ];
    
    let modified = false;
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern.from, pattern.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(servicePath, content);
      console.log(`✅ Fixed binding in ${servicePath}`);
      fixedCount++;
    } else if (content.includes("'127.0.0.1'")) {
      console.log(`✅ ${servicePath} - Already correct`);
    } else {
      console.log(`⚠️  ${servicePath} - Check manually`);
    }
  } else {
    console.log(`❌ ${servicePath} - File not found`);
  }
});

// Also rebuild affected services to ensure changes take effect
console.log(`\n📦 Fixed ${fixedCount} services`);
console.log('🔄 Rebuilding affected services...');

const { spawn } = require('child_process');

// Rebuild critical services that were showing 0.0.0.0 binding
const criticalServices = [
  'backend/domains/user-role-management',
  'backend/domains/company-management', 
  'backend/domains/order-management',
  'backend/domains/payment-processing',
  'backend/domains/performance-monitor',
  'backend/domains/reporting-management',
  'backend/domains/marketplace-management',
  'backend/domains/subscription-management'
];

criticalServices.forEach(servicePath => {
  if (fs.existsSync(servicePath)) {
    console.log(`🔨 Building ${servicePath}...`);
    try {
      const result = spawn('npm', ['run', 'build'], {
        cwd: servicePath,
        stdio: 'inherit'
      });
    } catch (error) {
      console.log(`⚠️  Build failed for ${servicePath}: ${error.message}`);
    }
  }
});

console.log('\n✅ Localhost binding enforcement complete!');
console.log('🔄 Restart the "All Microservices" workflow to apply changes');