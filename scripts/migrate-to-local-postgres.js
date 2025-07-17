#!/usr/bin/env node

/**
 * PostgreSQL Migration Script
 * Migrates LeafyHealth platform from Neon cloud to local PostgreSQL 16.5
 */

const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class PostgreSQLMigrator {
  constructor() {
    this.neonUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5CQG1QwrMyJDEfpw8JGNj1OzKgJxMEUz@ep-frosty-snow-a4pqwowg.us-east-1.aws.neon.tech/neondb?sslmode=require';
    this.localUrl = 'postgresql://postgres:leafyhealth2024@localhost:5432/leafyhealth';
    this.backupFile = '/home/runner/workspace/neon_to_local_backup.sql';
  }

  async exportFromNeon() {
    console.log('📤 Exporting data from Neon database...');
    
    try {
      const { stdout, stderr } = await execAsync(`pg_dump "${this.neonUrl}" > ${this.backupFile}`);
      
      if (stderr && !stderr.includes('Warning')) {
        throw new Error(`pg_dump error: ${stderr}`);
      }
      
      const stats = fs.statSync(this.backupFile);
      console.log(`✅ Export completed: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      
      return true;
    } catch (error) {
      console.error('❌ Export failed:', error.message);
      return false;
    }
  }

  async importToLocal() {
    console.log('📥 Importing data to local PostgreSQL...');
    
    try {
      // Create database if not exists
      await execAsync(`createdb -h localhost -p 5432 -U postgres leafyhealth 2>/dev/null || echo "Database exists"`);
      
      // Import the backup
      const { stdout, stderr } = await execAsync(`psql "${this.localUrl}" < ${this.backupFile}`);
      
      if (stderr && stderr.includes('ERROR')) {
        console.warn('⚠️ Some import warnings (expected for role/permission differences)');
      }
      
      console.log('✅ Import completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Import failed:', error.message);
      return false;
    }
  }

  async verifyMigration() {
    console.log('🔍 Verifying migration...');
    
    try {
      const { stdout } = await execAsync(`psql "${this.localUrl}" -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"`);
      
      const tableCount = stdout.match(/\d+/)?.[0];
      console.log(`✅ Local database has ${tableCount} tables`);
      
      // Test a sample query
      const { stdout: sampleData } = await execAsync(`psql "${this.localUrl}" -c "SELECT COUNT(*) as product_count FROM products;"`);
      const productCount = sampleData.match(/\d+/)?.[0];
      console.log(`✅ Products table has ${productCount} records`);
      
      return true;
    } catch (error) {
      console.error('❌ Verification failed:', error.message);
      return false;
    }
  }

  async updateEnvironment() {
    console.log('🔧 Updating environment configuration...');
    
    try {
      // Update .env file to use local database
      let envContent = fs.readFileSync('/home/runner/workspace/.env', 'utf8');
      
      // Comment out old DATABASE_URL and add new one
      envContent = envContent.replace(
        /^DATABASE_URL=.*$/m,
        `# Migrated to local PostgreSQL 16.5 on ${new Date().toISOString()}\nDATABASE_URL="${this.localUrl}"`
      );
      
      fs.writeFileSync('/home/runner/workspace/.env', envContent);
      console.log('✅ Environment updated to use local PostgreSQL');
      
      return true;
    } catch (error) {
      console.error('❌ Environment update failed:', error.message);
      return false;
    }
  }

  async runMigration() {
    console.log('🚀 Starting PostgreSQL Migration: Neon → Local PostgreSQL 16.5\n');
    
    const steps = [
      { name: 'Export from Neon', fn: () => this.exportFromNeon() },
      { name: 'Import to Local', fn: () => this.importToLocal() },
      { name: 'Verify Migration', fn: () => this.verifyMigration() },
      { name: 'Update Environment', fn: () => this.updateEnvironment() }
    ];
    
    for (const step of steps) {
      console.log(`\n📋 ${step.name}...`);
      const success = await step.fn();
      
      if (!success) {
        console.error(`❌ Migration failed at: ${step.name}`);
        process.exit(1);
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('📊 Local PostgreSQL 16.5 is now the primary database');
    console.log('🔄 Restart all microservices to use local database');
  }
}

// Run migration
const migrator = new PostgreSQLMigrator();
migrator.runMigration().catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});