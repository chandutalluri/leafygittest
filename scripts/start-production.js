#!/usr/bin/env node

/**
 * Production Start Script for LeafyHealth Platform
 * Starts all services and applications on Ubuntu VPS
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

class ProductionStarter {
  constructor() {
    this.rootDir = process.cwd();
    this.processes = new Map();
    this.isShuttingDown = false;
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async checkPort(port, timeout = 5000) {
    return new Promise((resolve) => {
      const timeoutHandle = setTimeout(() => resolve(false), timeout);
      
      const req = http.request({
        host: '127.0.0.1',
        port: port,
        timeout: 1000
      }, () => {
        clearTimeout(timeoutHandle);
        resolve(true);
      });

      req.on('error', () => {
        clearTimeout(timeoutHandle);
        resolve(false);
      });

      req.end();
    });
  }

  async waitForPort(port, maxWait = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      if (await this.checkPort(port)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }

  startProcess(name, command, cwd, env = {}) {
    return new Promise((resolve, reject) => {
      this.log(`Starting ${name}...`);
      
      const process = spawn('bash', ['-c', command], {
        cwd: cwd || this.rootDir,
        env: { 
          ...process.env, 
          NODE_ENV: 'production',
          ...env 
        },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      // Log output
      process.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`[${name}] ${output}`);
        }
      });

      process.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output && !output.includes('ExperimentalWarning')) {
          console.error(`[${name}] ${output}`);
        }
      });

      process.on('close', (code) => {
        this.log(`${name} exited with code ${code}`, code === 0 ? 'info' : 'error');
        this.processes.delete(name);
      });

      process.on('error', (error) => {
        this.log(`${name} error: ${error.message}`, 'error');
        this.processes.delete(name);
        reject(error);
      });

      this.processes.set(name, process);
      
      // Give the process a moment to start
      setTimeout(() => resolve(process), 2000);
    });
  }

  async startBackendServices() {
    this.log('Starting backend microservices...');
    
    const backendPath = path.join(this.rootDir, 'backend', 'domains');
    
    if (!fs.existsSync(backendPath)) {
      this.log('Backend services not found, skipping...', 'warning');
      return;
    }

    const services = fs.readdirSync(backendPath).filter(item => {
      const servicePath = path.join(backendPath, item);
      return fs.statSync(servicePath).isDirectory();
    });

    const servicePromises = services.slice(0, 5).map(async (service, index) => {
      try {
        const servicePath = path.join(backendPath, service);
        const mainFile = fs.existsSync(path.join(servicePath, 'main.js')) ? 'main.js' :
                        fs.existsSync(path.join(servicePath, 'src/main.ts')) ? 'src/main.ts' :
                        fs.existsSync(path.join(servicePath, 'index.js')) ? 'index.js' : null;
        
        if (mainFile) {
          const command = mainFile.endsWith('.ts') ? `npx ts-node ${mainFile}` : `node ${mainFile}`;
          await this.startProcess(`${service}`, command, servicePath);
          this.log(`✅ Started ${service}`, 'success');
          
          // Small delay between service starts
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          this.log(`No main file found for ${service}`, 'warning');
        }
      } catch (error) {
        this.log(`Failed to start ${service}: ${error.message}`, 'error');
      }
    });

    await Promise.allSettled(servicePromises);
  }

  async startServerComponents() {
    this.log('Starting server components...');
    
    const serverComponents = [
      { name: 'auth-service', file: 'server/authentication-service.js', port: 8085 },
      { name: 'data-gateway', file: 'server/direct-data-gateway.js', port: 8081 }
    ];

    for (const component of serverComponents) {
      try {
        const componentPath = path.join(this.rootDir, component.file);
        if (fs.existsSync(componentPath)) {
          await this.startProcess(component.name, `node ${component.file}`);
          
          if (component.port) {
            this.log(`Waiting for ${component.name} on port ${component.port}...`);
            await this.waitForPort(component.port, 10000);
          }
          
          this.log(`✅ Started ${component.name}`, 'success');
        }
      } catch (error) {
        this.log(`Failed to start ${component.name}: ${error.message}`, 'error');
      }
    }
  }

  async startUnifiedGateway() {
    this.log('Starting unified gateway...');
    
    const gatewayPath = path.join(this.rootDir, 'server/unified-gateway-fixed.js');
    
    if (fs.existsSync(gatewayPath)) {
      await this.startProcess('unified-gateway', `node server/unified-gateway-fixed.js`);
      
      this.log('Waiting for unified gateway on port 5000...');
      const gatewayReady = await this.waitForPort(5000, 30000);
      
      if (gatewayReady) {
        this.log('✅ Unified Gateway ready on port 5000', 'success');
        return true;
      } else {
        throw new Error('Gateway failed to start on port 5000');
      }
    } else {
      throw new Error('Unified gateway file not found');
    }
  }

  async createProductionHealthCheck() {
    const healthCheckPath = path.join(this.rootDir, 'health.js');
    const healthCheckContent = `
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      processes: ${this.processes.size}
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(5001, () => {
  console.log('Health check available at http://localhost:5001/health');
});
`;

    fs.writeFileSync(healthCheckPath, healthCheckContent);
    await this.startProcess('health-check', 'node health.js');
  }

  setupGracefulShutdown() {
    const shutdown = () => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;
      
      this.log('Shutting down gracefully...');
      
      for (const [name, process] of this.processes) {
        this.log(`Stopping ${name}...`);
        process.kill('SIGTERM');
      }
      
      setTimeout(() => {
        for (const [name, process] of this.processes) {
          if (!process.killed) {
            this.log(`Force killing ${name}...`, 'warning');
            process.kill('SIGKILL');
          }
        }
        process.exit(0);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('SIGUSR2', shutdown); // For nodemon compatibility
  }

  async start() {
    try {
      this.log('🚀 Starting LeafyHealth Platform in Production Mode');
      this.log(`📁 Working directory: ${this.rootDir}`);
      
      this.setupGracefulShutdown();
      
      // Start components in order
      await this.startBackendServices();
      await this.startServerComponents();
      await this.startUnifiedGateway();
      await this.createProductionHealthCheck();
      
      const startupTime = Date.now() - this.startTime;
      this.log(`🎉 LeafyHealth Platform started successfully in ${Math.floor(startupTime / 1000)}s`, 'success');
      this.log('🌐 Application available at: http://localhost:5000', 'success');
      this.log('❤️ Health check available at: http://localhost:5001/health', 'success');
      this.log(`📊 Running ${this.processes.size} processes`);
      
      // Keep the process alive
      process.stdin.resume();
      
    } catch (error) {
      this.log(`❌ Failed to start platform: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const starter = new ProductionStarter();
  starter.start().catch(console.error);
}

module.exports = ProductionStarter;