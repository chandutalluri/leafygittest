#!/usr/bin/env node

/**
 * Fast Frontend Restart Script
 * Optimized for rapid frontend application restarts during development
 */

const { spawn } = require('child_process');
const path = require('path');

class FastFrontendRestart {
  constructor() {
    this.processes = new Map();
    this.frontendApps = [
      { name: 'ecommerce-web', port: 3000, path: 'frontend/apps/ecommerce-web' },
      { name: 'ecommerce-mobile', port: 3001, path: 'frontend/apps/ecommerce-mobile' },
      { name: 'admin-portal', port: 3002, path: 'frontend/apps/admin-portal' },
      { name: 'super-admin', port: 3003, path: 'frontend/apps/super-admin' },
      { name: 'ops-delivery', port: 3004, path: 'frontend/apps/ops-delivery' }
    ];
  }

  async restartAll() {
    console.log('🚀 Fast Frontend Restart - Optimized for Speed');
    console.log('===============================================\n');

    // Kill existing processes first
    await this.killExistingProcesses();
    
    // Start all apps in parallel for maximum speed
    const startPromises = this.frontendApps.map(app => this.startApp(app));
    await Promise.all(startPromises);
    
    console.log('\n✅ All frontend applications restarted successfully!');
    console.log('🌐 Access through Gateway: http://localhost:5000');
    
    this.setupShutdown();
  }

  async killExistingProcesses() {
    console.log('🛑 Stopping existing frontend processes...\n');
    
    try {
      // Kill Next.js processes by port
      for (const app of this.frontendApps) {
        await this.killProcessOnPort(app.port);
      }
      
      // Give processes time to cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('⚠️  Some processes may not have been running');
    }
  }

  async killProcessOnPort(port) {
    return new Promise((resolve) => {
      const killCmd = process.platform === 'win32' 
        ? `netstat -ano | findstr :${port}` 
        : `lsof -ti:${port}`;
        
      const proc = spawn('sh', ['-c', killCmd], { stdio: 'pipe' });
      
      proc.stdout.on('data', (data) => {
        const pids = data.toString().trim().split('\n').filter(Boolean);
        pids.forEach(pid => {
          try {
            if (process.platform === 'win32') {
              spawn('taskkill', ['/F', '/PID', pid.split(/\s+/).pop()]);
            } else {
              process.kill(parseInt(pid), 'SIGTERM');
            }
          } catch (e) {
            // Process may already be dead
          }
        });
      });
      
      proc.on('close', () => resolve());
      
      // Timeout after 2 seconds
      setTimeout(() => resolve(), 2000);
    });
  }

  async startApp(app) {
    return new Promise((resolve) => {
      console.log(`🚀 Starting ${app.name} on port ${app.port}...`);
      
      const startTime = Date.now();
      
      const proc = spawn('npm', ['run', 'dev'], {
        cwd: path.join(process.cwd(), app.path),
        env: {
          ...process.env,
          PORT: app.port.toString(),
          NODE_ENV: 'development',
          // Optimization environment variables
          NEXT_WEBPACK_USEPOLLING: 'false',
          WATCHPACK_POLLING: 'false',
          // Disable telemetry for faster startup
          NEXT_TELEMETRY_DISABLED: '1'
        },
        stdio: 'pipe',
        detached: false
      });

      this.processes.set(app.name, proc);

      // Monitor startup
      proc.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready in') || output.includes('compiled')) {
          const duration = Date.now() - startTime;
          console.log(`✅ ${app.name} ready in ${duration}ms`);
          resolve();
        }
      });

      proc.stderr.on('data', (data) => {
        const output = data.toString();
        // Only show critical errors, suppress warnings
        if (output.includes('Error') && !output.includes('Warning')) {
          console.log(`❌ ${app.name}: ${output.trim()}`);
        }
      });

      proc.on('error', (error) => {
        console.log(`❌ Failed to start ${app.name}: ${error.message}`);
        resolve();
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        console.log(`⏰ ${app.name} startup timeout (30s)`);
        resolve();
      }, 30000);
    });
  }

  setupShutdown() {
    const shutdown = () => {
      console.log('\n🛑 Shutting down all frontend applications...');
      this.processes.forEach((proc, name) => {
        try {
          proc.kill('SIGTERM');
          console.log(`✅ Stopped ${name}`);
        } catch (e) {
          console.log(`⚠️  Could not stop ${name}`);
        }
      });
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

// Start fast restart
const restarter = new FastFrontendRestart();
restarter.restartAll().catch(console.error);