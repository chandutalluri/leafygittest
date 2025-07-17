const { Pool } = require('pg');
require('dotenv').config();

/**
 * Add Multi-Branch Support to All Business Tables
 * This script adds branch_id column to all business tables
 * to enable automatic multi-branch filtering
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 30000,
});

// Tables that should NOT have branch_id added
const EXEMPT_TABLES = [
  'branches', // Already has branch info
  'companies', // Company level, not branch level
  'sessions', // System table
  'schema_migrations', // System table
  'backup_jobs', // System table
  'restore_jobs', // System table
  'backup_schedules', // System table
  'branch_contexts', // Will be created separately
];

// Core business tables that need branch support
const PRIORITY_TABLES = [
  'products',
  'inventory',
  'orders',
  'customers',
  'employees',
  'vendors',
  'transactions',
  'payments',
  'carts',
  'cart_items',
];

async function addBranchSupport() {
  console.log('🏪 Adding Multi-Branch Support to Database Tables...\n');
  
  try {
    // First, create the branch_contexts table
    console.log('Creating branch_contexts table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS branch_contexts (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER NOT NULL,
        branch_id INTEGER NOT NULL REFERENCES branches(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(entity_type, entity_id, branch_id)
      );
    `);
    console.log('✅ branch_contexts table created\n');

    // Get all tables
    const tablesResult = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT IN (${EXEMPT_TABLES.map(t => `'${t}'`).join(', ')})
      ORDER BY 
        CASE 
          WHEN tablename IN (${PRIORITY_TABLES.map(t => `'${t}'`).join(', ')}) THEN 0
          ELSE 1
        END,
        tablename;
    `);

    const tables = tablesResult.rows;
    console.log(`Found ${tables.length} tables to process\n`);

    let successCount = 0;
    let alreadyHasCount = 0;
    let errorCount = 0;

    for (const { tablename } of tables) {
      try {
        // Check if column already exists
        const columnExists = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = $1 AND column_name = 'branch_id';
        `, [tablename]);

        if (columnExists.rows.length > 0) {
          console.log(`⏭️  ${tablename} - already has branch_id`);
          alreadyHasCount++;
          continue;
        }

        // Add branch_id column
        await pool.query(`
          ALTER TABLE ${tablename} 
          ADD COLUMN branch_id INTEGER;
        `);

        // Add foreign key constraint
        await pool.query(`
          ALTER TABLE ${tablename}
          ADD CONSTRAINT fk_${tablename}_branch
          FOREIGN KEY (branch_id) REFERENCES branches(id);
        `);

        // Create index for performance
        await pool.query(`
          CREATE INDEX idx_${tablename}_branch_id 
          ON ${tablename}(branch_id);
        `);

        // Set default branch_id for existing records (first branch)
        await pool.query(`
          UPDATE ${tablename} 
          SET branch_id = (SELECT id FROM branches ORDER BY id LIMIT 1)
          WHERE branch_id IS NULL;
        `);

        console.log(`✅ ${tablename} - added branch support`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${tablename} - error: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added branch support to ${successCount} tables`);
    console.log(`⏭️  ${alreadyHasCount} tables already had branch support`);
    console.log(`❌ ${errorCount} tables had errors`);

    // Update company settings to enable multi-branch by default
    console.log('\nEnabling multi-branch for all companies...');
    await pool.query(`
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS enable_multi_branch BOOLEAN DEFAULT true;
    `);
    
    await pool.query(`
      UPDATE companies SET enable_multi_branch = true;
    `);
    console.log('✅ Multi-branch enabled for all companies');

    // Add default branch flag
    console.log('\nSetting default branches...');
    await pool.query(`
      ALTER TABLE branches 
      ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
    `);
    
    // Set first branch of each company as default
    await pool.query(`
      UPDATE branches b1 SET is_default = true
      WHERE b1.id = (
        SELECT id FROM branches b2 
        WHERE b2.company_id = b1.company_id 
        ORDER BY id LIMIT 1
      );
    `);
    console.log('✅ Default branches set for each company');

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
addBranchSupport()
  .then(() => {
    console.log('\n🎉 Multi-branch support successfully added to database!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });