#!/usr/bin/env node

/**
 * Single Command Build and Run Script for LeafyHealth Platform
 * Builds everything and starts the production server with one command
 */

const { spawn } = require('child_process');
const fs = require('fs');

class BuildAndRun {
  constructor() {
    console.log('🚀 LeafyHealth Platform - Build and Run');
    console.log('=====================================');
  }

  async runCommand(command, description) {
    return new Promise((resolve, reject) => {
      console.log(`\n📋 ${description}...`);
      console.log(`💻 Executing: ${command}`);
      
      const process = spawn('bash', ['-c', command], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${description} completed successfully`);
          resolve();
        } else {
          console.log(`❌ ${description} failed with code ${code}`);
          reject(new Error(`${description} failed`));
        }
      });
    });
  }

  async execute() {
    try {
      console.log('🎯 Starting complete build and deployment process...\n');

      // Check if build script exists
      if (!fs.existsSync('scripts/build-production.js')) {
        throw new Error('Build script not found. Please ensure scripts/build-production.js exists.');
      }

      if (!fs.existsSync('scripts/start-production.js')) {
        throw new Error('Start script not found. Please ensure scripts/start-production.js exists.');
      }

      // Step 1: Build everything
      await this.runCommand('node scripts/build-production.js', 'Building all applications and services');

      // Small delay before starting
      console.log('\n⏳ Preparing to start services...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Start production server
      console.log('\n🚀 Starting production server...');
      console.log('💡 The server will run in the foreground. Press Ctrl+C to stop.');
      console.log('🌐 Application will be available at: http://localhost:5000');
      console.log('❤️ Health check will be at: http://localhost:5001/health');
      console.log('\n' + '='.repeat(60) + '\n');

      await this.runCommand('node scripts/start-production.js', 'Starting LeafyHealth Platform');

    } catch (error) {
      console.log(`\n❌ Error: ${error.message}`);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Ensure all dependencies are installed: npm install');
      console.log('2. Check that all required files exist');
      console.log('3. Verify database connection if using PostgreSQL');
      console.log('4. Review the DEPLOYMENT_GUIDE.md for detailed setup instructions');
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const buildAndRun = new BuildAndRun();
  buildAndRun.execute().catch(console.error);
}

module.exports = BuildAndRun;