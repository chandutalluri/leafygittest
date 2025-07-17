#!/usr/bin/env node
/**
 * Add remaining tables to reach 78+ tables for LeafyHealth Platform
 * This adds microservice-specific tables that were missing
 */

const { Client } = require('pg');

async function addRemainingTables() {
  console.log('🔧 Adding Remaining Tables to LeafyHealth Database');
  console.log('================================================\n');
  
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Integration Hub Tables
    console.log('🔌 Creating integration hub tables...');
    await client.query(`
      -- API integrations
      CREATE TABLE IF NOT EXISTS api_integrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        base_url VARCHAR(500) NOT NULL,
        api_key VARCHAR(500),
        headers JSONB,
        rate_limit INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Integration logs
      CREATE TABLE IF NOT EXISTS integration_logs (
        id SERIAL PRIMARY KEY,
        integration_id INTEGER REFERENCES api_integrations(id),
        endpoint VARCHAR(500),
        method VARCHAR(10),
        request_data JSONB,
        response_data JSONB,
        status_code INTEGER,
        duration_ms INTEGER,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Marketplace Management Tables
    console.log('🛍️ Creating marketplace management tables...');
    await client.query(`
      -- Marketplaces
      CREATE TABLE IF NOT EXISTS marketplaces (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        commission_rate DECIMAL(5,2),
        api_credentials JSONB,
        sync_settings JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Marketplace listings
      CREATE TABLE IF NOT EXISTS marketplace_listings (
        id SERIAL PRIMARY KEY,
        marketplace_id INTEGER REFERENCES marketplaces(id),
        product_id INTEGER REFERENCES products(id),
        listing_id VARCHAR(100),
        price DECIMAL(10,2),
        status VARCHAR(50),
        last_synced_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Multi-language Management Tables
    console.log('🌐 Creating multi-language management tables...');
    await client.query(`
      -- Languages
      CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(50) NOT NULL,
        native_name VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Translations
      CREATE TABLE IF NOT EXISTS translations (
        id SERIAL PRIMARY KEY,
        language_id INTEGER REFERENCES languages(id),
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER NOT NULL,
        field_name VARCHAR(100) NOT NULL,
        translation TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(language_id, entity_type, entity_id, field_name)
      );
    `);
    
    // Compliance Audit Tables
    console.log('📋 Creating compliance audit tables...');
    await client.query(`
      -- Compliance rules
      CREATE TABLE IF NOT EXISTS compliance_rules (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        rule_data JSONB,
        severity VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Compliance checks
      CREATE TABLE IF NOT EXISTS compliance_checks (
        id SERIAL PRIMARY KEY,
        rule_id INTEGER REFERENCES compliance_rules(id),
        entity_type VARCHAR(50),
        entity_id INTEGER,
        status VARCHAR(50),
        findings JSONB,
        checked_by VARCHAR REFERENCES users(id),
        checked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Image Management Enhanced Tables
    console.log('🖼️ Creating image management tables...');
    await client.query(`
      -- Image metadata
      CREATE TABLE IF NOT EXISTS image_metadata (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        original_name VARCHAR(255),
        mime_type VARCHAR(50),
        size_bytes INTEGER,
        width INTEGER,
        height INTEGER,
        alt_text VARCHAR(500),
        tags JSONB,
        uploaded_by VARCHAR REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Image transformations
      CREATE TABLE IF NOT EXISTS image_transformations (
        id SERIAL PRIMARY KEY,
        source_image_id INTEGER REFERENCES image_metadata(id),
        transformation_type VARCHAR(50),
        parameters JSONB,
        result_filename VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Get final table count
    const countResult = await client.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableCount = countResult.rows[0].table_count;
    
    console.log('\n✅ Additional tables created successfully!');
    console.log(`📊 Total tables now: ${tableCount}`);
    
  } catch (error) {
    console.error('❌ Failed to add tables:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the script
addRemainingTables().catch(console.error);