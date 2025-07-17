#!/usr/bin/env node

/**
 * Comprehensive Investigation of All 29 Microservices
 * This script performs deep analysis of each service
 */

const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// All 29 microservices with detailed info
const SERVICES = [
  // Group 1: Core Infrastructure (3 services)
  { 
    name: 'Authentication Service', 
    port: 8085, 
    group: 'Core Infrastructure',
    type: 'node',
    file: 'server/auth-service-fixed.js',
    endpoints: ['/api/auth/login', '/api/auth/register']
  },
  { 
    name: 'Direct Data Gateway', 
    port: 8081, 
    group: 'Core Infrastructure',
    type: 'node',
    file: 'server/direct-data-gateway.js',
    endpoints: ['/api/products', '/api/categories', '/api/branches']
  },
  { 
    name: 'Database Backup Restore', 
    port: 3045, 
    group: 'Core Infrastructure',
    type: 'nest',
    path: 'backend/domains/database-backup-restore',
    endpoints: ['/backups', '/restore']
  },
  
  // Group 2: Identity & Access Management (4 services)
  { 
    name: 'Identity Access', 
    port: 3020, 
    group: 'Identity & Access',
    type: 'nest',
    path: 'backend/domains/identity-access',
    endpoints: []
  },
  { 
    name: 'User Role Management', 
    port: 3011, 
    group: 'Identity & Access',
    type: 'nest',
    path: 'backend/domains/user-role-management',
    endpoints: ['/users', '/roles']
  },
  { 
    name: 'Company Management', 
    port: 3013, 
    group: 'Identity & Access',
    type: 'nest',
    path: 'backend/domains/company-management',
    endpoints: ['/company-management/companies', '/company-management/branches']
  },
  { 
    name: 'Compliance Audit', 
    port: 3016, 
    group: 'Identity & Access',
    type: 'nest',
    path: 'backend/domains/compliance-audit',
    endpoints: []
  },
  
  // Group 3: Product & Catalog (5 services)
  { 
    name: 'Catalog Management', 
    port: 3022, 
    group: 'Product & Catalog',
    type: 'nest',
    path: 'backend/domains/catalog-management',
    endpoints: ['/products', '/categories']
  },
  { 
    name: 'Product Orchestrator', 
    port: 3042, 
    group: 'Product & Catalog',
    type: 'nest',
    path: 'backend/domains/product-orchestrator',
    endpoints: ['/products/create', '/products/update']
  },
  { 
    name: 'Image Management', 
    port: 3035, 
    group: 'Product & Catalog',
    type: 'ts-node',
    path: 'backend/domains/image-management',
    endpoints: ['/images/upload', '/images/serve']
  },
  { 
    name: 'Label Design', 
    port: 3027, 
    group: 'Product & Catalog',
    type: 'nest',
    path: 'backend/domains/label-design',
    endpoints: ['/templates', '/labels/generate']
  },
  { 
    name: 'Multi Language Management', 
    port: 3019, 
    group: 'Product & Catalog',
    type: 'nest',
    path: 'backend/domains/multi-language-management',
    endpoints: ['/translations']
  },
  
  // Group 4: Order & Commerce (6 services)
  { 
    name: 'Order Management', 
    port: 3030, 
    group: 'Order & Commerce',
    type: 'nest',
    path: 'backend/domains/order-management',
    endpoints: ['/orders', '/orders/status']
  },
  { 
    name: 'Inventory Management', 
    port: 3025, 
    group: 'Order & Commerce',
    type: 'nest',
    path: 'backend/domains/inventory-management',
    endpoints: ['/inventory', '/inventory/stock']
  },
  { 
    name: 'Payment Processing', 
    port: 3031, 
    group: 'Order & Commerce',
    type: 'nest',
    path: 'backend/domains/payment-processing',
    endpoints: ['/payments', '/transactions']
  },
  { 
    name: 'Marketplace Management', 
    port: 3036, 
    group: 'Order & Commerce',
    type: 'nest',
    path: 'backend/domains/marketplace-management',
    endpoints: []
  },
  { 
    name: 'Subscription Management', 
    port: 3037, 
    group: 'Order & Commerce',
    type: 'nest',
    path: 'backend/domains/subscription-management',
    endpoints: ['/subscriptions']
  },
  { 
    name: 'Traditional Orders', 
    port: 3050, 
    group: 'Order & Commerce',
    type: 'node',
    file: 'server/traditional-orders-service.js',
    endpoints: ['/items', '/categories', '/orders']
  },
  
  // Group 5: Customer & Communication (4 services)
  { 
    name: 'Customer Service', 
    port: 3024, 
    group: 'Customer & Communication',
    type: 'nest',
    path: 'backend/domains/customer-service',
    endpoints: ['/tickets', '/support']
  },
  { 
    name: 'Notification Service', 
    port: 3032, 
    group: 'Customer & Communication',
    type: 'nest',
    path: 'backend/domains/notification-service',
    endpoints: ['/notifications/send']
  },
  { 
    name: 'Shipping Delivery', 
    port: 3034, 
    group: 'Customer & Communication',
    type: 'nest',
    path: 'backend/domains/shipping-delivery',
    endpoints: ['/shipments', '/tracking']
  },
  { 
    name: 'Content Management', 
    port: 3017, 
    group: 'Customer & Communication',
    type: 'nest',
    path: 'backend/domains/content-management',
    endpoints: ['/content', '/pages']
  },
  
  // Group 6: Business Operations (7 services)
  { 
    name: 'Employee Management', 
    port: 3028, 
    group: 'Business Operations',
    type: 'nest',
    path: 'backend/domains/employee-management',
    endpoints: ['/employees', '/schedules']
  },
  { 
    name: 'Accounting Management', 
    port: 3014, 
    group: 'Business Operations',
    type: 'nest',
    path: 'backend/domains/accounting-management',
    endpoints: ['/accounts', '/transactions']
  },
  { 
    name: 'Expense Monitoring', 
    port: 3021, 
    group: 'Business Operations',
    type: 'nest',
    path: 'backend/domains/expense-monitoring',
    endpoints: ['/expenses', '/reports']
  },
  { 
    name: 'Analytics Reporting', 
    port: 3015, 
    group: 'Business Operations',
    type: 'nest',
    path: 'backend/domains/analytics-reporting',
    endpoints: ['/analytics', '/reports']
  },
  { 
    name: 'Performance Monitor', 
    port: 3029, 
    group: 'Business Operations',
    type: 'nest',
    path: 'backend/domains/performance-monitor',
    endpoints: ['/metrics', '/health']
  },
  { 
    name: 'Reporting Management', 
    port: 3033, 
    group: 'Business Operations',
    type: 'nest',
    path: 'backend/domains/reporting-management',
    endpoints: ['/reports', '/templates']
  },
  { 
    name: 'Integration Hub', 
    port: 3018, 
    group: 'Business Operations',
    type: 'nest',
    path: 'backend/domains/integration-hub',
    endpoints: ['/integrations', '/webhooks']
  }
];

async function checkEndpoint(port, path, method = 'GET') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          data: data.slice(0, 100) // First 100 chars
        });
      });
    });

    req.on('error', () => {
      resolve({ status: 0, success: false, data: 'Connection failed' });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, success: false, data: 'Timeout' });
    });

    req.end();
  });
}

function checkCodeImplementation(service) {
  const result = {
    hasCode: false,
    isBuilt: false,
    hasControllers: false,
    hasServices: false,
    hasModels: false,
    fileCount: 0
  };

  try {
    if (service.type === 'node' && service.file) {
      result.hasCode = fs.existsSync(service.file);
      result.isBuilt = result.hasCode;
    } else if (service.type === 'nest' && service.path) {
      const distPath = path.join(service.path, 'dist/main.js');
      result.isBuilt = fs.existsSync(distPath);
      
      const srcPath = path.join(service.path, 'src');
      if (fs.existsSync(srcPath)) {
        const files = execSync(`find ${srcPath} -name "*.ts" | wc -l`).toString().trim();
        result.fileCount = parseInt(files);
        result.hasCode = result.fileCount > 1;
        
        result.hasControllers = fs.existsSync(path.join(srcPath, 'controllers')) || 
                               execSync(`find ${srcPath} -name "*.controller.ts" | wc -l`).toString().trim() !== '0';
        result.hasServices = fs.existsSync(path.join(srcPath, 'services')) || 
                            execSync(`find ${srcPath} -name "*.service.ts" | wc -l`).toString().trim() !== '0';
        result.hasModels = fs.existsSync(path.join(srcPath, 'models')) || 
                          fs.existsSync(path.join(srcPath, 'entities')) ||
                          execSync(`find ${srcPath} -name "*.entity.ts" -o -name "*.model.ts" | wc -l`).toString().trim() !== '0';
      }
    }
  } catch (e) {
    // Silent fail
  }

  return result;
}

async function investigateService(service) {
  console.log(`\n📋 Investigating: ${service.name} (Port ${service.port})`);
  console.log('─'.repeat(50));

  // Check if service is running
  const health = await checkEndpoint(service.port, '/health');
  const docs = await checkEndpoint(service.port, '/api/docs');
  
  const isRunning = health.success || docs.success;
  console.log(`Status: ${isRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);

  // Check code implementation
  const code = checkCodeImplementation(service);
  console.log(`\nCode Analysis:`);
  console.log(`  Built/Compiled: ${code.isBuilt ? '✅' : '❌'}`);
  console.log(`  Has Source Code: ${code.hasCode ? '✅' : '❌'} (${code.fileCount} files)`);
  
  if (service.type === 'nest') {
    console.log(`  Has Controllers: ${code.hasControllers ? '✅' : '❌'}`);
    console.log(`  Has Services: ${code.hasServices ? '✅' : '❌'}`);
    console.log(`  Has Models: ${code.hasModels ? '✅' : '❌'}`);
  }

  // Test endpoints if running
  if (isRunning && service.endpoints.length > 0) {
    console.log(`\nEndpoint Tests:`);
    for (const endpoint of service.endpoints) {
      const result = await checkEndpoint(service.port, endpoint);
      console.log(`  ${endpoint}: ${result.success ? '✅' : '❌'} (${result.status})`);
    }
  }

  // Determine verdict
  let verdict = 'EMPTY';
  if (isRunning && code.hasCode && (code.hasControllers || service.type === 'node')) {
    verdict = 'WORKING';
  } else if (code.hasCode && code.fileCount > 3) {
    verdict = 'PARTIAL';
  } else if (!code.hasCode || code.fileCount <= 1) {
    verdict = 'EMPTY';
  }

  console.log(`\n🏷️  VERDICT: ${verdict}`);
  
  return {
    ...service,
    isRunning,
    code,
    verdict,
    health: health.success,
    docs: docs.success
  };
}

async function main() {
  console.log('🔬 COMPREHENSIVE MICROSERVICES INVESTIGATION');
  console.log('=' .repeat(60));
  console.log(`Investigating all ${SERVICES.length} services in detail...\n`);

  const results = [];
  const summary = {
    working: 0,
    partial: 0,
    empty: 0,
    total: SERVICES.length
  };

  for (const service of SERVICES) {
    const result = await investigateService(service);
    results.push(result);
    
    if (result.verdict === 'WORKING') summary.working++;
    else if (result.verdict === 'PARTIAL') summary.partial++;
    else summary.empty++;
  }

  // Final Report
  console.log('\n\n' + '=' .repeat(60));
  console.log('📊 FINAL REPORT');
  console.log('=' .repeat(60));
  
  console.log(`\n✅ WORKING Services (${summary.working}/${summary.total}):`);
  results.filter(r => r.verdict === 'WORKING').forEach(r => {
    console.log(`   - ${r.name} (Port ${r.port})`);
  });
  
  console.log(`\n⚠️  PARTIAL Implementation (${summary.partial}/${summary.total}):`);
  results.filter(r => r.verdict === 'PARTIAL').forEach(r => {
    console.log(`   - ${r.name} (Port ${r.port}) - ${r.isRunning ? 'Running' : 'Not Running'}`);
  });
  
  console.log(`\n❌ EMPTY/Boilerplate (${summary.empty}/${summary.total}):`);
  results.filter(r => r.verdict === 'EMPTY').forEach(r => {
    console.log(`   - ${r.name} (Port ${r.port})`);
  });

  console.log(`\n📈 Summary:`);
  console.log(`   Working: ${summary.working} (${Math.round(summary.working/summary.total*100)}%)`);
  console.log(`   Partial: ${summary.partial} (${Math.round(summary.partial/summary.total*100)}%)`);
  console.log(`   Empty: ${summary.empty} (${Math.round(summary.empty/summary.total*100)}%)`);
}

main().catch(console.error);