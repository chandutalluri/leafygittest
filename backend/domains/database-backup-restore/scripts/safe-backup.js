#!/usr/bin/env node
/**
 * Safe Database Backup Script
 * Uses pg_dump with minimal resource usage to prevent service crashes
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is required');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(process.cwd(), 'backups');
const fileName = `safe-backup-${timestamp}.sql`;
const filePath = path.join(backupDir, fileName);

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log(`Starting safe backup to ${fileName}...`);

// Use pg_dump with minimal options to reduce resource usage
const pgDumpCommand = `pg_dump "${process.env.DATABASE_URL}" \
  --no-owner \
  --no-privileges \
  --no-tablespaces \
  --clean \
  --if-exists \
  --exclude-table-data=sessions \
  --exclude-table-data=backup_jobs \
  --exclude-table-data=restore_jobs \
  > "${filePath}"`;

const startTime = Date.now();

exec(pgDumpCommand, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  if (error) {
    console.error(`Backup failed after ${duration}s:`, error.message);
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
  console.log(`🔒 Checksum: ${checksum}`);
  
  // Create backup metadata
  const metadata = {
    fileName,
    filePath,
    size: fileSize,
    checksum,
    createdAt: new Date().toISOString(),
    duration: `${duration}s`,
    type: 'safe-backup'
  };

  // Save metadata
  const metadataPath = filePath.replace('.sql', '.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`📄 Metadata saved to ${path.basename(metadataPath)}`);
  process.exit(0);
});