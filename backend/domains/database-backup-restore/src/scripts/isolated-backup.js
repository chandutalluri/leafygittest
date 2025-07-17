#!/usr/bin/env node

/**
 * Isolated Database Backup Script
 * Runs independently with its own connection pool to avoid conflicts
 */

const { Pool } = require('pg');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get command line arguments
const [,, jobId, fileName] = process.argv;

if (!jobId || !fileName) {
  console.error('Usage: node isolated-backup.js <jobId> <fileName>');
  process.exit(1);
}

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2, // Minimal pool to avoid conflicts
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function createBackup() {
  const startTime = Date.now();
  const backupPath = `/tmp/backups/${fileName}`;
  
  try {
    // Ensure backup directory exists
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`Starting backup for job ${jobId}...`);

    // Parse DATABASE_URL for pg_dump
    const dbUrl = new URL(process.env.DATABASE_URL);
    const pgDumpCommand = `PGPASSWORD="${dbUrl.password}" pg_dump -h ${dbUrl.hostname} -p ${dbUrl.port || 5432} -U ${dbUrl.username} -d ${dbUrl.pathname.slice(1)} -f "${backupPath}" --format=custom --no-owner --no-privileges --verbose`;

    // Execute pg_dump
    await new Promise((resolve, reject) => {
      exec(pgDumpCommand, { timeout: 300000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('pg_dump error:', error);
          reject(error);
        } else {
          console.log('pg_dump completed:', stdout);
          if (stderr) console.log('pg_dump stderr:', stderr);
          resolve();
        }
      });
    });

    // Get file size
    const stats = fs.statSync(backupPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    const fileSize = `${fileSizeKB} KB`;

    // Calculate checksum
    const crypto = require('crypto');
    const fileBuffer = fs.readFileSync(backupPath);
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const duration = Date.now() - startTime;
    console.log(`Backup completed in ${duration}ms. File: ${backupPath}, Size: ${fileSize}`);

    // Update database record
    await pool.query(
      `UPDATE backup_jobs SET 
       status = 'completed', 
       completed_at = NOW(), 
       file_size = $1, 
       checksum = $2,
       metadata = $3
       WHERE job_id = $4`,
      [
        fileSize,
        checksum,
        JSON.stringify({
          localPath: backupPath,
          duration: duration,
          pgDumpVersion: 'custom'
        }),
        jobId
      ]
    );

    console.log(`Backup job ${jobId} completed successfully`);
    process.exit(0);

  } catch (error) {
    console.error(`Backup failed for job ${jobId}:`, error);
    
    // Update database with error
    await pool.query(
      `UPDATE backup_jobs SET 
       status = 'failed', 
       completed_at = NOW(), 
       error = $1
       WHERE job_id = $2`,
      [error.message, jobId]
    ).catch(console.error);

    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('Backup process terminated');
  await pool.end();
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Backup process interrupted');
  await pool.end();
  process.exit(1);
});

// Start backup
createBackup().catch(async (error) => {
  console.error('Fatal error:', error);
  await pool.end();
  process.exit(1);
});