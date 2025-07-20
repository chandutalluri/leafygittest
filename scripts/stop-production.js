#!/usr/bin/env node

/**
 * Production Stop Script for LeafyHealth Platform
 * Gracefully stops all running services
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProductionStopper {
  constructor() {
    this.log('🛑 Stopping LeafyHealth Platform...');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async execCommand(command) {
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (stdout) this.log(stdout.trim());
        if (stderr) this.log(stderr.trim(), 'warning');
        resolve();
      });
    });
  }

  async stop() {
    try {
      // Stop main production process
      this.log('Stopping main production processes...');
      await this.execCommand("pkill -f 'scripts/start-production.js' || true");
      
      // Stop Node.js processes on specific ports
      const ports = [5000, 5001, 8085, 8081, 3035];
      for (const port of ports) {
        this.log(`Stopping processes on port ${port}...`);
        await this.execCommand(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
      }
      
      // Stop any remaining Node.js processes from our project
      this.log('Stopping remaining LeafyHealth processes...');
      await this.execCommand("pkill -f 'node.*unified-gateway' || true");
      await this.execCommand("pkill -f 'node.*authentication-service' || true");
      await this.execCommand("pkill -f 'node.*direct-data-gateway' || true");
      await this.execCommand("pkill -f 'node.*image-management' || true");
      
      // Clean up any stray processes
      await this.execCommand("pkill -f 'node.*main.js' || true");
      await this.execCommand("pkill -f 'health.js' || true");
      
      this.log('✅ LeafyHealth Platform stopped successfully', 'success');
      
    } catch (error) {
      this.log(`Error stopping platform: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const stopper = new ProductionStopper();
  stopper.stop().catch(console.error);
}

module.exports = ProductionStopper;