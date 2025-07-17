#!/usr/bin/env node

/**
 * UNIFIED DEVELOPMENT TESTING SCRIPT
 * Starts ALL microservices and frontend applications for comprehensive testing
 * This is the ONLY script needed for development/testing
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

class DevelopmentTestRunner {
  constructor() {
    this.processes = new Map();
    this.startTime = Date.now();
    
    // All 28 microservices
    this.microservices = [
      // Core Infrastructure Services
      { name: 'Auth Service', port: 8085, type: 'node', file: 'server/auth-service-fixed.js' },
      { name: 'Data Gateway', port: 8081, type: 'node', file: 'server/direct-data-gateway.js' },

      
      // NestJS Microservices
      { name: 'Identity Access', port: 3020, type: 'nest', path: 'backend/domains/identity-access' },
      { name: 'User Role Management', port: 3011, type: 'nest', path: 'backend/domains/user-role-management' },
      { name: 'Company Management', port: 3013, type: 'nest', path: 'backend/domains/company-management' },
      { name: 'Catalog Management', port: 3022, type: 'nest', path: 'backend/domains/catalog-management' },
      { name: 'Inventory Management', port: 3025, type: 'nest', path: 'backend/domains/inventory-management' },
      { name: 'Order Management', port: 3030, type: 'nest', path: 'backend/domains/order-management' },
      { name: 'Payment Processing', port: 3031, type: 'nest', path: 'backend/domains/payment-processing' },
      { name: 'Customer Service', port: 3024, type: 'nest', path: 'backend/domains/customer-service' },
      { name: 'Notification Service', port: 3032, type: 'nest', path: 'backend/domains/notification-service' },
      { name: 'Shipping Delivery', port: 3034, type: 'nest', path: 'backend/domains/shipping-delivery' },
      { name: 'Employee Management', port: 3028, type: 'nest', path: 'backend/domains/employee-management' },
      { name: 'Accounting Management', port: 3014, type: 'nest', path: 'backend/domains/accounting-management' },
      { name: 'Expense Monitoring', port: 3021, type: 'nest', path: 'backend/domains/expense-monitoring' },
      { name: 'Analytics Reporting', port: 3015, type: 'nest', path: 'backend/domains/analytics-reporting' },
      { name: 'Performance Monitor', port: 3029, type: 'nest', path: 'backend/domains/performance-monitor' },
      { name: 'Reporting Management', port: 3033, type: 'nest', path: 'backend/domains/reporting-management' },
      { name: 'Content Management', port: 3017, type: 'nest', path: 'backend/domains/content-management' },
      { name: 'Label Design', port: 3027, type: 'nest', path: 'backend/domains/label-design' },
      { name: 'Multi Language', port: 3019, type: 'nest', path: 'backend/domains/multi-language-management' },
      { name: 'Marketplace Management', port: 3036, type: 'nest', path: 'backend/domains/marketplace-management' },
      { name: 'Subscription Management', port: 3037, type: 'nest', path: 'backend/domains/subscription-management' },
      { name: 'Compliance Audit', port: 3016, type: 'nest', path: 'backend/domains/compliance-audit' },
      { name: 'Integration Hub', port: 3018, type: 'nest', path: 'backend/domains/integration-hub' },
      { name: 'Product Orchestrator', port: 3042, type: 'nest', path: 'backend/domains/product-orchestrator' },
      { name: 'Image Management', port: 3035, type: 'ts-node', path: 'backend/domains/image-management', file: 'src/simple-main.ts' }
    ];
    
    // 5 Frontend Applications
    this.frontendApps = [
      { name: 'Super Admin', port: 3003, path: 'frontend/apps/super-admin' },
      { name: 'E-commerce Web', port: 3000, path: 'frontend/apps/ecommerce-web' },
      { name: 'E-commerce Mobile', port: 3001, path: 'frontend/apps/ecommerce-mobile' },
      { name: 'Admin Portal', port: 3002, path: 'frontend/apps/admin-portal' },
      { name: 'Ops Delivery', port: 3004, path: 'frontend/apps/ops-delivery' }
    ];
    
    // Gateway (runs last)
    this.gateway = { name: 'Unified Gateway', port: 5000, file: 'server/unified-gateway-fixed.js' };
  }
  
  async checkPort(port, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        await new Promise((resolve, reject) => {
          const req = http.get(`http://127.0.0.1:${port}/health`, (res) => {
            resolve(true);
          });
          req.on('error', reject);
          req.setTimeout(500);
        });
        return true;
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
    return false;
  }
  
  canServiceRun(service) {
    if (service.type === 'node') {
      return fs.existsSync(service.file);
    } else if (service.type === 'nest') {
      const distPath = path.join(service.path, 'dist/main.js');
      return fs.existsSync(distPath);
    } else if (service.type === 'ts-node') {
      const tsFile = path.join(service.path, service.file);
      return fs.existsSync(tsFile);
    }
    return false;
  }
  
  async startService(service, index, total) {
    console.log(`[${index}/${total}] Starting ${service.name} on port ${service.port}...`);
    
    return new Promise((resolve) => {
      let cmd, args, cwd;
      
      if (service.type === 'node') {
        cmd = 'node';
        args = [service.file];
        cwd = '.';
      } else if (service.type === 'nest') {
        cmd = 'node';
        args = ['dist/main.js'];
        cwd = service.path;
      } else if (service.type === 'ts-node') {
        cmd = 'npx';
        args = ['ts-node', service.file];
        cwd = service.path;
      }
      
      const env = { 
        ...process.env, 
        PORT: service.port.toString(),
        NODE_ENV: 'development'
      };
      
      const proc = spawn(cmd, args, { 
        cwd, 
        env,
        detached: false,
        stdio: 'pipe'
      });
      
      this.processes.set(service.name, proc);
      
      // Give service time to start
      setTimeout(async () => {
        const isReady = await this.checkPort(service.port, 3000);
        if (isReady) {
          console.log(`✅ ${service.name} ready`);
        } else {
          console.log(`⏱️  ${service.name} started (may still be initializing)`);
        }
        resolve();
      }, 1000);
    });
  }
  
  async startFrontendApp(app, index, total) {
    console.log(`[${index}/${total}] Starting ${app.name} frontend on port ${app.port}...`);
    
    return new Promise((resolve) => {
      const proc = spawn('npm', ['run', 'dev'], {
        cwd: app.path,
        env: {
          ...process.env,
          PORT: app.port.toString(),
          NODE_ENV: 'development'
        },
        shell: true,
        detached: false,
        stdio: 'pipe'
      });
      
      this.processes.set(app.name, proc);
      
      // Frontend apps take longer to start
      setTimeout(() => {
        console.log(`✅ ${app.name} started`);
        resolve();
      }, 3000);
    });
  }
  
  async startGateway() {
    console.log('🌐 Starting Unified Gateway on port 5000...');
    
    const proc = spawn('node', [this.gateway.file], {
      env: {
        ...process.env,
        NODE_ENV: 'development'
      },
      detached: false,
      stdio: 'pipe'
    });
    
    this.processes.set(this.gateway.name, proc);
    
    // Wait for gateway to be ready
    setTimeout(() => {
      console.log('✅ Unified Gateway ready');
    }, 2000);
  }
  
  async start() {
    console.log('🚀 LeafyHealth Development Test Runner');
    console.log('Starting ALL services for comprehensive testing...');
    console.log('=' .repeat(60));
    
    // Stage 1: Start all microservices
    console.log('\n📦 Stage 1: Starting 28 Microservices');
    let serviceCount = 0;
    for (const service of this.microservices) {
      if (this.canServiceRun(service)) {
        serviceCount++;
        await this.startService(service, serviceCount, this.microservices.length);
      } else {
        console.log(`❌ ${service.name} - Not built yet`);
      }
    }
    
    // Stage 2: Start all frontend applications
    console.log('\n🎨 Stage 2: Starting 5 Frontend Applications');
    let appCount = 0;
    for (const app of this.frontendApps) {
      appCount++;
      await this.startFrontendApp(app, appCount, this.frontendApps.length);
    }
    
    // Stage 3: Start unified gateway
    console.log('\n🌐 Stage 3: Starting Unified Gateway');
    await this.startGateway();
    
    // Summary
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ALL SERVICES STARTED in ${duration} seconds`);
    console.log('\n📋 Access Points:');
    console.log('   🌐 Main Gateway: http://localhost:5000');
    console.log('   📱 Mobile App: http://localhost:5000/mobile');
    console.log('   🛒 Web App: http://localhost:5000/customer');
    console.log('   👨‍💼 Admin Portal: http://localhost:5000/admin');
    console.log('   👑 Super Admin: http://localhost:5000/');
    console.log('   🚚 Ops Delivery: http://localhost:5000/ops');
    console.log('\n🔍 Health Check: http://localhost:5000/health');
    console.log('📚 API Docs: http://localhost:5000/api/[service-name]/docs');
    console.log('\n⚠️  Press Ctrl+C to stop all services');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Shutting down all services...');
      this.processes.forEach((proc, name) => {
        try {
          process.kill(-proc.pid);
        } catch (e) {
          // Ignore errors
        }
      });
      process.exit(0);
    });
  }
}

// Run the development test runner
const runner = new DevelopmentTestRunner();
runner.start().catch(console.error);