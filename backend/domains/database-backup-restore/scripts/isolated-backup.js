#!/usr/bin/env node
/**
 * Isolated Database Backup Script
 * Runs completely separately from the main application to prevent crashes
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Parse DATABASE_URL to get connection parameters
function parseDatabaseUrl(url) {
  const regex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5]
  };
}

// Main backup function
async function performBackup() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  const fileName = `isolated-backup-${timestamp}.sql`;
  const filePath = path.join(backupDir, fileName);

  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`Starting isolated backup to ${fileName}...`);

  try {
    // Parse database connection
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    
    // Set environment variables for pg_dump
    const env = {
      ...process.env,
      PGHOST: dbConfig.host,
      PGPORT: dbConfig.port,
      PGUSER: dbConfig.user,
      PGPASSWORD: dbConfig.password,
      PGDATABASE: dbConfig.database
    };

    // Create write stream
    const writeStream = fs.createWriteStream(filePath);
    
    // Run pg_dump with spawn for better control
    const pgDump = spawn('pg_dump', [
      '--no-owner',
      '--no-privileges',
      '--no-tablespaces',
      '--clean',
      '--if-exists',
      '--exclude-table-data=sessions',
      '--exclude-table-data=backup_jobs',
      '--exclude-table-data=restore_jobs'
    ], {
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const startTime = Date.now();
    let errorOutput = '';

    // Pipe output to file
    pgDump.stdout.pipe(writeStream);

    // Capture errors
    pgDump.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle completion
    pgDump.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      if (code !== 0) {
        console.error(`Backup failed with exit code ${code}`);
        console.error('Error output:', errorOutput);
        
        // Clean up failed backup
        try {
          fs.unlinkSync(filePath);
        } catch {}
        
        process.exit(1);
      }

      // Get file size
      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / (1024 * 1024)).toFixed(2) + ' MB';

      // Calculate checksum
      const fileBuffer = fs.readFileSync(filePath);
      const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      console.log(`✅ Backup completed successfully in ${duration}s`);
      console.log(`📁 File: ${fileName}`);
      console.log(`📊 Size: ${fileSize}`);
      console.log(`🔒 Checksum: ${checksum.substring(0, 16)}...`);
      
      // Create backup metadata
      const metadata = {
        fileName,
        filePath,
        size: fileSize,
        checksum,
        createdAt: new Date().toISOString(),
        duration: `${duration}s`,
        type: 'isolated-backup'
      };

      // Save metadata
      const metadataPath = filePath.replace('.sql', '.json');
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`📄 Metadata saved`);
      process.exit(0);
    });

  } catch (error) {
    console.error('Backup error:', error.message);
    process.exit(1);
  }
}

// Run backup
performBackup();