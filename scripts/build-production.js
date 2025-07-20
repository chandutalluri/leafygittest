#!/usr/bin/env node

/**
 * Production Build Script for LeafyHealth Platform
 * Builds all frontend applications and backend services for Ubuntu VPS deployment
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class ProductionBuilder {
  constructor() {
    this.rootDir = process.cwd();
    this.buildLog = [];
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const coloredMessage = type === 'error' ? chalk.red(message) : 
                          type === 'success' ? chalk.green(message) : 
                          type === 'warning' ? chalk.yellow(message) : 
                          chalk.blue(message);
    
    console.log(`[${timestamp}] ${coloredMessage}`);
    this.buildLog.push(`[${timestamp}] ${message}`);
  }

  async execCommand(command, cwd = this.rootDir) {
    return new Promise((resolve, reject) => {
      this.log(`Executing: ${command}`, 'info');
      
      const process = spawn('bash', ['-c', command], { 
        cwd, 
        stdio: ['inherit', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production' }
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(data.toString().trim());
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(data.toString().trim());
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  async createProductionDirectories() {
    this.log('Creating production directories...', 'info');
    
    const dirs = [
      'dist',
      'dist/frontend',
      'dist/backend',
      'dist/logs',
      'dist/uploads',
      'dist/uploads/images'
    ];

    dirs.forEach(dir => {
      const fullPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`, 'success');
      }
    });
  }

  async buildFrontendApplications() {
    this.log('Building frontend applications...', 'info');
    
    const frontendApps = [
      'ecommerce-web',
      'ecommerce-mobile', 
      'super-admin',
      'admin-portal',
      'ops-delivery'
    ];

    for (const app of frontendApps) {
      try {
        this.log(`Building ${app}...`, 'info');
        const appPath = path.join(this.rootDir, 'frontend', 'apps', app);
        
        if (!fs.existsSync(appPath)) {
          this.log(`App directory not found: ${appPath}`, 'warning');
          continue;
        }

        // Install dependencies if needed
        await this.execCommand('npm ci --production', appPath);
        
        // Build the application
        await this.execCommand('npm run build', appPath);
        
        // Copy build output to dist
        const buildOutput = path.join(appPath, '.next');
        const distPath = path.join(this.rootDir, 'dist', 'frontend', app);
        
        if (fs.existsSync(buildOutput)) {
          await this.execCommand(`cp -r ${buildOutput} ${distPath}`);
          await this.execCommand(`cp -r ${appPath}/public ${distPath}/public`);
          await this.execCommand(`cp ${appPath}/package.json ${distPath}/`);
          this.log(`✅ ${app} built successfully`, 'success');
        }
        
      } catch (error) {
        this.log(`❌ Failed to build ${app}: ${error.message}`, 'error');
      }
    }
  }

  async buildBackendServices() {
    this.log('Building backend services...', 'info');
    
    const backendPath = path.join(this.rootDir, 'backend', 'domains');
    
    if (!fs.existsSync(backendPath)) {
      this.log('Backend domains directory not found', 'warning');
      return;
    }

    const services = fs.readdirSync(backendPath).filter(item => {
      const servicePath = path.join(backendPath, item);
      return fs.statSync(servicePath).isDirectory();
    });

    for (const service of services) {
      try {
        this.log(`Building service: ${service}...`, 'info');
        const servicePath = path.join(backendPath, service);
        const packageJsonPath = path.join(servicePath, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
          // Install dependencies
          await this.execCommand('npm ci --production', servicePath);
          
          // Build if build script exists
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          if (packageJson.scripts && packageJson.scripts.build) {
            await this.execCommand('npm run build', servicePath);
          }
        }

        // Copy service to dist
        const distServicePath = path.join(this.rootDir, 'dist', 'backend', service);
        await this.execCommand(`cp -r ${servicePath} ${distServicePath}`);
        
        this.log(`✅ Service ${service} built successfully`, 'success');
        
      } catch (error) {
        this.log(`❌ Failed to build service ${service}: ${error.message}`, 'error');
      }
    }
  }

  async buildServerComponents() {
    this.log('Building server components...', 'info');
    
    const serverPath = path.join(this.rootDir, 'server');
    const distServerPath = path.join(this.rootDir, 'dist', 'server');
    
    if (fs.existsSync(serverPath)) {
      await this.execCommand(`cp -r ${serverPath} ${distServerPath}`);
      this.log('✅ Server components copied', 'success');
    }

    // Copy shared components
    const sharedPath = path.join(this.rootDir, 'shared');
    const distSharedPath = path.join(this.rootDir, 'dist', 'shared');
    
    if (fs.existsSync(sharedPath)) {
      await this.execCommand(`cp -r ${sharedPath} ${distSharedPath}`);
      this.log('✅ Shared components copied', 'success');
    }
  }

  async createProductionPackageJson() {
    this.log('Creating production package.json...', 'info');
    
    const originalPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const productionPackageJson = {
      name: originalPackageJson.name,
      version: originalPackageJson.version,
      description: originalPackageJson.description,
      scripts: {
        "start": "node scripts/start-production.js",
        "stop": "node scripts/stop-production.js",
        "restart": "node scripts/restart-production.js",
        "health": "node scripts/health-check.js"
      },
      dependencies: originalPackageJson.dependencies,
      engines: originalPackageJson.engines || {
        "node": ">=20.0.0",
        "npm": ">=9.0.0"
      }
    };

    fs.writeFileSync(
      path.join(this.rootDir, 'dist', 'package.json'), 
      JSON.stringify(productionPackageJson, null, 2)
    );
    
    this.log('✅ Production package.json created', 'success');
  }

  async copyEnvironmentFiles() {
    this.log('Copying environment files...', 'info');
    
    const envFiles = ['.env', '.env.local', '.env.production'];
    
    for (const envFile of envFiles) {
      const sourcePath = path.join(this.rootDir, envFile);
      const destPath = path.join(this.rootDir, 'dist', envFile);
      
      if (fs.existsSync(sourcePath)) {
        await this.execCommand(`cp ${sourcePath} ${destPath}`);
        this.log(`✅ Copied ${envFile}`, 'success');
      }
    }
  }

  async generateBuildReport() {
    const buildTime = Date.now() - this.startTime;
    const report = {
      buildTime: `${Math.floor(buildTime / 1000)}s`,
      timestamp: new Date().toISOString(),
      platform: 'Ubuntu 22.04',
      nodeVersion: process.version,
      buildLog: this.buildLog
    };

    fs.writeFileSync(
      path.join(this.rootDir, 'dist', 'build-report.json'),
      JSON.stringify(report, null, 2)
    );

    this.log(`🎉 Build completed in ${Math.floor(buildTime / 1000)}s`, 'success');
    this.log(`📋 Build report saved to dist/build-report.json`, 'info');
  }

  async build() {
    try {
      this.log('🚀 Starting production build for LeafyHealth Platform', 'info');
      
      await this.createProductionDirectories();
      await this.buildFrontendApplications();
      await this.buildBackendServices();
      await this.buildServerComponents();
      await this.createProductionPackageJson();
      await this.copyEnvironmentFiles();
      await this.generateBuildReport();
      
      this.log('✅ Production build completed successfully!', 'success');
      this.log('📦 Ready for deployment to Ubuntu VPS', 'success');
      
    } catch (error) {
      this.log(`❌ Build failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Execute build if run directly
if (require.main === module) {
  const builder = new ProductionBuilder();
  builder.build().catch(console.error);
}

module.exports = ProductionBuilder;