#!/usr/bin/env node
/**
 * Production-Safe Database Backup Script
 * 
 * This script creates database backups without crashing the application.
 * It runs completely separately from the main application to avoid connection pool issues.
 * 
 * Usage: node scripts/production-safe-backup.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple logger
const log = (message) => console.log(`[${new Date().toISOString()}] ${message}`);
const error = (message) => console.error(`[${new Date().toISOString()}] ERROR: ${message}`);

async function createSafeBackup() {
  if (!process.env.DATABASE_URL) {
    error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  const fileName = `production-safe-backup-${timestamp}.json`;
  const filePath = path.join(backupDir, fileName);

  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Create a dedicated connection pool with minimal connections
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2, // Use only 2 connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  try {
    log('Starting production-safe database backup...');
    const startTime = Date.now();

    const backupData = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        type: 'production-safe-json-backup',
        database: process.env.DATABASE_URL.split('/').pop().split('?')[0],
      },
      schema: {},
      data: {},
      summary: {}
    };

    // Get all tables
    const tablesResult = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename NOT IN ('sessions', 'backup_jobs', 'restore_jobs')
      ORDER BY tablename
    `);

    const tables = tablesResult.rows.map(row => row.tablename);
    log(`Found ${tables.length} tables to backup`);

    // Backup each table
    for (const table of tables) {
      try {
        // Get table schema
        const schemaResult = await pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [table]);

        backupData.schema[table] = schemaResult.rows;

        // Get table data with row limit for large tables
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        const rowCount = parseInt(countResult.rows[0].count);
        
        // For large tables, only backup recent data
        let query = `SELECT * FROM ${table}`;
        if (rowCount > 10000) {
          // Check if table has created_at or similar timestamp column
          const hasTimestamp = schemaResult.rows.some(col => 
            ['created_at', 'createdat', 'timestamp'].includes(col.column_name.toLowerCase())
          );
          
          if (hasTimestamp) {
            query += ` ORDER BY created_at DESC LIMIT 5000`;
            log(`Table ${table} has ${rowCount} rows, backing up only recent 5000`);
          } else {
            query += ` LIMIT 5000`;
            log(`Table ${table} has ${rowCount} rows, backing up first 5000`);
          }
        }

        const dataResult = await pool.query(query);
        backupData.data[table] = dataResult.rows;
        
        backupData.summary[table] = {
          totalRows: rowCount,
          backedUpRows: dataResult.rows.length,
          columns: schemaResult.rows.length
        };

        log(`✓ Backed up ${dataResult.rows.length} rows from ${table}`);
      } catch (err) {
        error(`Failed to backup table ${table}: ${err.message}`);
        backupData.summary[table] = { error: err.message };
      }
    }

    // Write backup to file
    const jsonContent = JSON.stringify(backupData, null, 2);
    fs.writeFileSync(filePath, jsonContent);

    // Calculate statistics
    const stats = fs.statSync(filePath);
    const fileSize = (stats.size / (1024 * 1024)).toFixed(2) + ' MB';
    const checksum = crypto.createHash('sha256').update(jsonContent).digest('hex').substring(0, 16);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const totalRows = Object.values(backupData.summary).reduce(
      (sum, table) => sum + (table.backedUpRows || 0), 0
    );

    // Create backup report
    const report = {
      fileName,
      filePath,
      fileSize,
      checksum,
      duration: `${duration}s`,
      tablesBackedUp: Object.keys(backupData.data).length,
      totalRowsBackedUp: totalRows,
      createdAt: new Date().toISOString(),
      summary: backupData.summary
    };

    // Save report
    const reportPath = filePath.replace('.json', '-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    log('═'.repeat(60));
    log('✅ BACKUP COMPLETED SUCCESSFULLY');
    log('═'.repeat(60));
    log(`📁 Backup File: ${fileName}`);
    log(`📊 Size: ${fileSize}`);
    log(`🔒 Checksum: ${checksum}`);
    log(`⏱️  Duration: ${duration}s`);
    log(`📋 Tables: ${Object.keys(backupData.data).length}`);
    log(`📝 Total Rows: ${totalRows}`);
    log('═'.repeat(60));

    return report;

  } catch (err) {
    error(`Backup failed: ${err.message}`);
    throw err;
  } finally {
    // Always close the pool
    await pool.end();
    log('Database connection closed');
  }
}

// Run backup if called directly
if (require.main === module) {
  createSafeBackup()
    .then(() => {
      log('Backup script completed');
      process.exit(0);
    })
    .catch((err) => {
      error('Backup script failed:', err);
      process.exit(1);
    });
}

module.exports = { createSafeBackup };