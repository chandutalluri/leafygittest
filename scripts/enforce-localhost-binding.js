#!/usr/bin/env node

/**
 * CRITICAL SECURITY SCRIPT
 * Enforces localhost-only binding for all microservices
 * This prevents microservices from being exposed externally
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 ENFORCING LOCALHOST-ONLY BINDING FOR ALL MICROSERVICES');
console.log('============================================================');

// Update all NestJS microservices to bind to 127.0.0.1 only
const nestDomains = [
  'backend/domains/identity-access',
  'backend/domains/user-role-management', 
  'backend/domains/company-management',
  'backend/domains/catalog-management',
  'backend/domains/inventory-management',
  'backend/domains/order-management',
  'backend/domains/payment-processing',
  'backend/domains/customer-service',
  'backend/domains/notification-service',
  'backend/domains/shipping-delivery',
  'backend/domains/employee-management',
  'backend/domains/accounting-management',
  'backend/domains/expense-monitoring',
  'backend/domains/analytics-reporting',
  'backend/domains/performance-monitor',
  'backend/domains/reporting-management',
  'backend/domains/content-management',
  'backend/domains/label-design',
  'backend/domains/multi-language-management',
  'backend/domains/marketplace-management',
  'backend/domains/subscription-management',
  'backend/domains/compliance-audit',
  'backend/domains/integration-hub',
  'backend/domains/product-orchestrator',
  'backend/domains/image-management'
];

// Check and fix each NestJS main.ts file
nestDomains.forEach(domain => {
  const mainPath = path.join(domain, 'src/main.ts');
  if (fs.existsSync(mainPath)) {
    let content = fs.readFileSync(mainPath, 'utf8');
    
    // Check if already binding to localhost
    if (!content.includes('127.0.0.1') && !content.includes('localhost')) {
      console.log(`⚠️  ${domain} - No localhost binding found`);
      
      // Update to bind to localhost only
      content = content.replace(
        /await app\.listen\(PORT\)/g,
        "await app.listen(PORT, '127.0.0.1')"
      );
      content = content.replace(
        /await app\.listen\(process\.env\.PORT/g,
        "await app.listen(process.env.PORT || 3000, '127.0.0.1'"
      );
      
      fs.writeFileSync(mainPath, content);
      console.log(`✅ ${domain} - Updated to bind to localhost only`);
    } else {
      console.log(`✅ ${domain} - Already binding to localhost`);
    }
  }
});

// Update Node.js services
const nodeServices = [
  { file: 'server/auth-service-fixed.js', port: 8085 },
  { file: 'server/direct-data-gateway.js', port: 8081 },

];

nodeServices.forEach(service => {
  if (fs.existsSync(service.file)) {
    let content = fs.readFileSync(service.file, 'utf8');
    
    // Check if binding to 0.0.0.0 (which allows external access)
    if (content.includes('0.0.0.0')) {
      console.log(`⚠️  ${service.file} - Binding to 0.0.0.0 (EXTERNAL ACCESS!)`);
      
      // Replace 0.0.0.0 with 127.0.0.1
      content = content.replace(/0\.0\.0\.0/g, '127.0.0.1');
      fs.writeFileSync(service.file, content);
      console.log(`✅ ${service.file} - Updated to bind to localhost only`);
    } else if (content.includes('127.0.0.1') || content.includes('localhost')) {
      console.log(`✅ ${service.file} - Already binding to localhost`);
    } else {
      console.log(`⚠️  ${service.file} - Check binding configuration`);
    }
  }
});

console.log('\n📋 IMPORTANT STEPS TO COMPLETE:');
console.log('1. Go to Replit project settings');
console.log('2. Find "Ports" or "Networking" section');
console.log('3. Remove ALL port mappings except port 5000');
console.log('4. Only port 5000 should have external access');
console.log('\n🔒 This ensures microservices are NEVER exposed externally!');