#!/usr/bin/env node

/**
 * Performance Monitor for Frontend Restart Issues
 * Monitors system resources and identifies bottlenecks
 */

const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      memory: {},
      cpu: {},
      disk: {},
      network: {},
      processes: {}
    };
  }

  async analyzeRestartBottlenecks() {
    console.log('🔍 Performance Analysis for Frontend Restart Issues');
    console.log('==================================================\n');

    await this.checkSystemResources();
    await this.analyzeNodeModules();
    await this.checkNextjsConfig();
    await this.identifyHeavyProcesses();
    await this.generateReport();
  }

  async checkSystemResources() {
    console.log('📊 Checking System Resources...\n');

    try {
      // Memory usage
      const memInfo = await this.execCommand('free -h');
      console.log('💾 Memory Usage:');
      console.log(memInfo);

      // CPU usage
      const cpuInfo = await this.execCommand('top -bn1 | grep "Cpu(s)"');
      console.log('🔥 CPU Usage:');
      console.log(cpuInfo);

      // Disk I/O
      const diskInfo = await this.execCommand('df -h .');
      console.log('💿 Disk Usage:');
      console.log(diskInfo);

    } catch (error) {
      console.log('⚠️  Could not gather system metrics');
    }
  }

  async analyzeNodeModules() {
    console.log('\n📦 Analyzing Node.js Dependencies...\n');

    try {
      // Check node_modules size
      const moduleSize = await this.execCommand('du -sh node_modules 2>/dev/null || echo "node_modules not found"');
      console.log('📁 Node Modules Size:', moduleSize.trim());

      // Check for heavy packages
      const heavyPackages = await this.execCommand('du -sh node_modules/* 2>/dev/null | sort -hr | head -10 || echo "Cannot analyze packages"');
      console.log('🏋️  Heaviest Packages:');
      console.log(heavyPackages);

      // Check for multiple Next.js versions
      const nextVersions = await this.execCommand('find node_modules -name "next" -type d 2>/dev/null || echo "No Next.js found"');
      if (nextVersions.includes('\n')) {
        console.log('⚠️  Multiple Next.js installations detected (may cause conflicts):');
        console.log(nextVersions);
      }

    } catch (error) {
      console.log('⚠️  Could not analyze node_modules');
    }
  }

  async checkNextjsConfig() {
    console.log('\n⚙️  Analyzing Next.js Configurations...\n');

    const frontendApps = [
      'frontend/apps/ecommerce-web',
      'frontend/apps/ecommerce-mobile',
      'frontend/apps/admin-portal',
      'frontend/apps/super-admin',
      'frontend/apps/ops-delivery'
    ];

    for (const app of frontendApps) {
      const configPath = path.join(app, 'next.config.js');
      try {
        const configExists = await fs.access(configPath).then(() => true).catch(() => false);
        if (configExists) {
          const config = await fs.readFile(configPath, 'utf8');
          
          // Check for performance issues
          const issues = [];
          if (config.includes('optimizeCss: true')) issues.push('CSS optimization enabled in dev');
          if (config.includes('reactStrictMode: true')) issues.push('React Strict Mode enabled');
          if (config.includes('swcMinify: true')) issues.push('SWC minification enabled');
          if (config.includes('disable: false') && config.includes('PWA')) issues.push('PWA enabled in development');
          
          console.log(`📱 ${app}:`);
          if (issues.length > 0) {
            console.log('   ⚠️  Performance Issues:', issues.join(', '));
          } else {
            console.log('   ✅ Configuration looks optimized');
          }
        }
      } catch (error) {
        console.log(`❌ Could not analyze ${app}`);
      }
    }
  }

  async identifyHeavyProcesses() {
    console.log('\n🔍 Identifying Heavy Processes...\n');

    try {
      // Find Node.js processes
      const nodeProcesses = await this.execCommand('ps aux | grep node | grep -v grep | head -20');
      console.log('🟢 Active Node.js Processes:');
      console.log(nodeProcesses);

      // Find Next.js processes specifically
      const nextProcesses = await this.execCommand('ps aux | grep "next dev" | grep -v grep');
      const processCount = nextProcesses.split('\n').filter(line => line.trim()).length;
      console.log(`\n📊 Active Next.js Dev Servers: ${processCount}`);

      if (processCount > 5) {
        console.log('⚠️  Warning: Too many Next.js processes may cause resource contention');
      }

    } catch (error) {
      console.log('⚠️  Could not analyze processes');
    }
  }

  async generateReport() {
    console.log('\n📋 Performance Recommendations');
    console.log('===============================\n');

    const recommendations = [
      '🚀 QUICK FIXES:',
      '   • Disable PWA in development mode (already done)',
      '   • Turn off CSS optimization in development',
      '   • Disable React Strict Mode for faster builds',
      '   • Reduce onDemandEntries buffer size',
      '',
      '⚡ STARTUP OPTIMIZATIONS:',
      '   • Use SWC only in production builds',
      '   • Enable webpack caching for faster rebuilds',
      '   • Reduce file watching scope',
      '   • Disable telemetry collection',
      '',
      '🧹 MAINTENANCE:',
      '   • Clean node_modules if larger than 1GB',
      '   • Remove duplicate Next.js installations',
      '   • Use npm/yarn workspaces for shared dependencies',
      '   • Consider using pnpm for faster installs',
      '',
      '🔧 SYSTEM LEVEL:',
      '   • Ensure adequate RAM (8GB+ recommended)',
      '   • Use SSD storage for faster I/O',
      '   • Close unused applications during development',
      '   • Use --max-old-space-size=4096 for Node.js'
    ];

    recommendations.forEach(rec => console.log(rec));

    console.log('\n✅ Configuration files have been optimized for faster restarts');
    console.log('🔄 Restart your frontend applications to see improvements');
  }

  async execCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve(stderr || error.message);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}

// Run performance analysis
const monitor = new PerformanceMonitor();
monitor.analyzeRestartBottlenecks().catch(console.error);