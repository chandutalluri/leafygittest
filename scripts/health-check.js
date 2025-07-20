#!/usr/bin/env node

/**
 * Health Check Script for LeafyHealth Platform
 * Monitors all services and provides health status
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class HealthChecker {
  constructor() {
    this.services = [
      { name: 'Unified Gateway', url: 'http://localhost:5000/health' },
      { name: 'Auth Service', url: 'http://localhost:8085/health' },
      { name: 'Data Gateway', url: 'http://localhost:8081/health' },
      { name: 'Image Management', url: 'http://localhost:3035/api/image-management/health' }
    ];
  }

  async checkService(service) {
    return new Promise((resolve) => {
      const url = new URL(service.url);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              name: service.name,
              status: 'healthy',
              statusCode: res.statusCode,
              response: parsed,
              responseTime: Date.now() - startTime
            });
          } catch (e) {
            resolve({
              name: service.name,
              status: 'unhealthy',
              statusCode: res.statusCode,
              error: 'Invalid JSON response',
              responseTime: Date.now() - startTime
            });
          }
        });
      });

      const startTime = Date.now();

      req.on('error', (error) => {
        resolve({
          name: service.name,
          status: 'down',
          error: error.message,
          responseTime: Date.now() - startTime
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          name: service.name,
          status: 'timeout',
          error: 'Request timeout',
          responseTime: 5000
        });
      });

      req.end();
    });
  }

  async checkAllServices() {
    console.log('🔍 Checking LeafyHealth Platform Health...\n');
    
    const promises = this.services.map(service => this.checkService(service));
    const results = await Promise.all(promises);
    
    let overallStatus = 'healthy';
    let healthyCount = 0;
    
    results.forEach(result => {
      const icon = result.status === 'healthy' ? '✅' : 
                  result.status === 'down' ? '❌' : 
                  result.status === 'timeout' ? '⏰' : '⚠️';
      
      console.log(`${icon} ${result.name}: ${result.status.toUpperCase()}`);
      
      if (result.statusCode) {
        console.log(`   Status Code: ${result.statusCode}`);
      }
      
      if (result.responseTime) {
        console.log(`   Response Time: ${result.responseTime}ms`);
      }
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.response && result.response.uptime) {
        console.log(`   Uptime: ${Math.floor(result.response.uptime)}s`);
      }
      
      console.log('');
      
      if (result.status === 'healthy') {
        healthyCount++;
      } else {
        overallStatus = 'degraded';
      }
    });
    
    if (healthyCount === 0) {
      overallStatus = 'down';
    }
    
    console.log('📊 Overall System Status:', overallStatus.toUpperCase());
    console.log(`📈 Services Healthy: ${healthyCount}/${this.services.length}`);
    
    // Check system resources
    this.checkSystemResources();
    
    return {
      overallStatus,
      healthyCount,
      totalServices: this.services.length,
      services: results,
      timestamp: new Date().toISOString()
    };
  }

  checkSystemResources() {
    try {
      console.log('\n💻 System Resources:');
      
      // Memory usage
      const memoryUsage = process.memoryUsage();
      console.log(`   Memory: ${Math.round(memoryUsage.rss / 1024 / 1024)}MB RSS`);
      
      // CPU usage (basic)
      console.log(`   CPU: Process uptime ${Math.floor(process.uptime())}s`);
      
      // Disk space (if available)
      if (fs.existsSync('/opt/leafyhealth')) {
        console.log('   Application directory: ✅ Accessible');
      }
      
    } catch (error) {
      console.log(`   Error checking resources: ${error.message}`);
    }
  }

  async startHealthServer() {
    const server = http.createServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      if (req.url === '/health') {
        const healthStatus = await this.checkAllServices();
        res.statusCode = healthStatus.overallStatus === 'down' ? 503 : 200;
        res.end(JSON.stringify(healthStatus, null, 2));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    });

    server.listen(5001, '0.0.0.0', () => {
      console.log('❤️ Health check server running on http://localhost:5001/health');
    });

    return server;
  }
}

// Execute based on command line arguments
if (require.main === module) {
  const checker = new HealthChecker();
  
  if (process.argv.includes('--server')) {
    checker.startHealthServer();
  } else {
    checker.checkAllServices().then(result => {
      process.exit(result.overallStatus === 'down' ? 1 : 0);
    });
  }
}

module.exports = HealthChecker;