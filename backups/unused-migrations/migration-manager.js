/**
 * Database Migration Manager
 * Professional-grade migration system for LeafyHealth Platform
 * Environment-agnostic and supports multiple database providers
 */

const fs = require('fs').promises;
const path = require('path');
const { Client } = require('pg');

class MigrationManager {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl || process.env.DATABASE_URL;
    if (!this.databaseUrl) {
      throw new Error('Database URL is required. Set DATABASE_URL environment variable.');
    }
  }

  async connect() {
    this.client = new Client({
      connectionString: this.databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
    await this.client.connect();
    console.log('✅ Connected to database');
  }

  async disconnect() {
    if (this.client) {
      await this.client.end();
      console.log('🔌 Disconnected from database');
    }
  }

  async createMigrationTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        execution_time_ms INTEGER,
        checksum VARCHAR(64),
        success BOOLEAN DEFAULT true,
        error_message TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_migrations_version ON schema_migrations(version);
      CREATE INDEX IF NOT EXISTS idx_migrations_executed ON schema_migrations(executed_at);
    `;
    
    await this.client.query(createTableQuery);
    console.log('✅ Migration table ready');
  }

  async getExecutedMigrations() {
    const result = await this.client.query(
      'SELECT version FROM schema_migrations WHERE success = true ORDER BY version'
    );
    return result.rows.map(row => row.version);
  }

  async getMigrationFiles() {
    const migrationsDir = path.join(process.cwd(), 'migrations');
    try {
      const files = await fs.readdir(migrationsDir);
      return files
        .filter(file => file.endsWith('.sql'))
        .sort();
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📁 Creating migrations directory...');
        await fs.mkdir(migrationsDir, { recursive: true });
        return [];
      }
      throw error;
    }
  }

  async calculateChecksum(content) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  async runMigration(filename) {
    const startTime = Date.now();
    const version = filename.replace('.sql', '');
    const filepath = path.join(process.cwd(), 'migrations', filename);
    
    try {
      console.log(`\n🔄 Running migration: ${filename}`);
      
      // Read migration file
      const content = await fs.readFile(filepath, 'utf8');
      const checksum = await this.calculateChecksum(content);
      
      // Check if already executed
      const existing = await this.client.query(
        'SELECT checksum FROM schema_migrations WHERE version = $1',
        [version]
      );
      
      if (existing.rows.length > 0) {
        if (existing.rows[0].checksum !== checksum) {
          throw new Error(`Migration ${version} has been modified after execution!`);
        }
        console.log(`⏭️  Migration ${version} already executed`);
        return;
      }
      
      // Execute migration in transaction
      await this.client.query('BEGIN');
      
      try {
        await this.client.query(content);
        
        // Record successful migration
        await this.client.query(
          `INSERT INTO schema_migrations (version, name, execution_time_ms, checksum, success) 
           VALUES ($1, $2, $3, $4, $5)`,
          [version, filename, Date.now() - startTime, checksum, true]
        );
        
        await this.client.query('COMMIT');
        console.log(`✅ Migration ${version} completed in ${Date.now() - startTime}ms`);
        
      } catch (error) {
        await this.client.query('ROLLBACK');
        
        // Record failed migration
        await this.client.query(
          `INSERT INTO schema_migrations (version, name, execution_time_ms, checksum, success, error_message) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [version, filename, Date.now() - startTime, checksum, false, error.message]
        );
        
        throw error;
      }
      
    } catch (error) {
      console.error(`❌ Migration ${version} failed:`, error.message);
      throw error;
    }
  }

  async migrate() {
    try {
      await this.connect();
      await this.createMigrationTable();
      
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();
      
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file.replace('.sql', ''))
      );
      
      if (pendingMigrations.length === 0) {
        console.log('✅ Database is up to date');
        return;
      }
      
      console.log(`📊 Found ${pendingMigrations.length} pending migrations`);
      
      for (const migration of pendingMigrations) {
        await this.runMigration(migration);
      }
      
      console.log('\n✅ All migrations completed successfully');
      
    } finally {
      await this.disconnect();
    }
  }

  async rollback(steps = 1) {
    try {
      await this.connect();
      
      const result = await this.client.query(
        `SELECT version, name FROM schema_migrations 
         WHERE success = true 
         ORDER BY executed_at DESC 
         LIMIT $1`,
        [steps]
      );
      
      if (result.rows.length === 0) {
        console.log('No migrations to rollback');
        return;
      }
      
      for (const row of result.rows) {
        const rollbackFile = path.join(
          process.cwd(), 
          'migrations', 
          `rollback_${row.version}.sql`
        );
        
        try {
          const content = await fs.readFile(rollbackFile, 'utf8');
          
          await this.client.query('BEGIN');
          await this.client.query(content);
          await this.client.query(
            'DELETE FROM schema_migrations WHERE version = $1',
            [row.version]
          );
          await this.client.query('COMMIT');
          
          console.log(`✅ Rolled back migration: ${row.name}`);
          
        } catch (error) {
          console.error(`❌ Failed to rollback ${row.name}:`, error.message);
          await this.client.query('ROLLBACK');
        }
      }
      
    } finally {
      await this.disconnect();
    }
  }

  async status() {
    try {
      await this.connect();
      await this.createMigrationTable();
      
      const executed = await this.getExecutedMigrations();
      const files = await this.getMigrationFiles();
      
      console.log('\n📊 Migration Status:');
      console.log('==================');
      
      for (const file of files) {
        const version = file.replace('.sql', '');
        const isExecuted = executed.includes(version);
        console.log(`${isExecuted ? '✅' : '⏳'} ${file}`);
      }
      
      console.log(`\nTotal: ${files.length} migrations`);
      console.log(`Executed: ${executed.length}`);
      console.log(`Pending: ${files.length - executed.length}`);
      
    } finally {
      await this.disconnect();
    }
  }

  async reset() {
    try {
      await this.connect();
      
      console.log('⚠️  This will drop all tables and data!');
      console.log('Proceeding with database reset...');
      
      // Get all tables
      const tables = await this.client.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename != 'schema_migrations'
      `);
      
      // Drop all tables
      for (const { tablename } of tables.rows) {
        await this.client.query(`DROP TABLE IF EXISTS ${tablename} CASCADE`);
        console.log(`🗑️  Dropped table: ${tablename}`);
      }
      
      // Clear migration history
      await this.client.query('TRUNCATE schema_migrations');
      
      console.log('✅ Database reset complete');
      
    } finally {
      await this.disconnect();
    }
  }
}

// CLI Interface
if (require.main === module) {
  const command = process.argv[2];
  const manager = new MigrationManager();
  
  const commands = {
    'migrate': () => manager.migrate(),
    'rollback': () => manager.rollback(process.argv[3] || 1),
    'status': () => manager.status(),
    'reset': () => manager.reset(),
  };
  
  const handler = commands[command];
  
  if (!handler) {
    console.log('Usage: node migration-manager.js [command]');
    console.log('Commands:');
    console.log('  migrate   - Run pending migrations');
    console.log('  rollback  - Rollback migrations (default: 1)');
    console.log('  status    - Show migration status');
    console.log('  reset     - Reset database (WARNING: drops all data)');
    process.exit(1);
  }
  
  handler().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = MigrationManager;