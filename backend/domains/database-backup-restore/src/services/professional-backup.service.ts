import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
// import { parseConnectionString } from 'pg-connection-string';

const execAsync = promisify(exec);
const fsPromises = fs.promises;

@Injectable()
export class ProfessionalBackupService {
  private readonly logger = new Logger(ProfessionalBackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups');

  constructor() {
    this.ensureBackupDirectory();
  }

  private async ensureBackupDirectory() {
    try {
      await fsPromises.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create backup directory: ${error.message}`);
    }
  }

  /**
   * Create a professional PostgreSQL backup using pg_dump
   * This method uses industry best practices to avoid connection pool issues
   */
  async createProfessionalBackup(type: 'logical' | 'custom' = 'custom') {
    try {
      this.logger.log('Starting professional PostgreSQL backup...');
      
      // Parse connection string manually
      const databaseUrl = process.env.DATABASE_URL;
      const urlParts = new URL(databaseUrl);
      
      const config = {
        host: urlParts.hostname,
        port: urlParts.port || '5432',
        user: urlParts.username,
        password: urlParts.password,
        database: urlParts.pathname.slice(1), // Remove leading slash
      };
      
      // Generate backup filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = type === 'logical' ? 'sql' : 'dump';
      const fileName = `professional-backup-${timestamp}.${extension}`;
      const filePath = path.join(this.backupDir, fileName);
      
      // Build pg_dump command based on type
      let command: string;
      
      if (type === 'logical') {
        // Logical backup - human readable SQL
        command = `PGPASSWORD="${config.password}" pg_dump ` +
          `-h "${config.host}" ` +
          `-p "${config.port}" ` +
          `-U "${config.user}" ` +
          `-d "${config.database}" ` +
          `--no-owner ` +
          `--no-privileges ` +
          `--clean ` +
          `--if-exists ` +
          `-f "${filePath}"`;
      } else {
        // Custom format - compressed and faster restore
        command = `PGPASSWORD="${config.password}" pg_dump ` +
          `-h "${config.host}" ` +
          `-p "${config.port}" ` +
          `-U "${config.user}" ` +
          `-d "${config.database}" ` +
          `--format=custom ` +
          `--no-owner ` +
          `--no-privileges ` +
          `--compress=9 ` +
          `-f "${filePath}"`;
      }
      
      // Execute pg_dump with timeout
      const startTime = Date.now();
      this.logger.log(`Executing backup command...`);
      
      const { stdout, stderr } = await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: config.password
        },
        timeout: 300000, // 5 minutes timeout
        maxBuffer: 1024 * 1024 * 50 // 50MB buffer
      });
      
      if (stderr && !stderr.includes('warning')) {
        this.logger.warn(`pg_dump warnings: ${stderr}`);
      }
      
      // Verify backup file was created
      const stats = await fsPromises.stat(filePath);
      const fileSize = (stats.size / (1024 * 1024)).toFixed(2);
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Calculate checksum
      const fileContent = await fsPromises.readFile(filePath);
      const checksum = crypto.createHash('sha256')
        .update(fileContent)
        .digest('hex')
        .substring(0, 16);
      
      // Get table count
      const tableCountCmd = `PGPASSWORD="${config.password}" psql ` +
        `-h "${config.host}" ` +
        `-p "${config.port}" ` +
        `-U "${config.user}" ` +
        `-d "${config.database}" ` +
        `-t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"`;
      
      const { stdout: tableCount } = await execAsync(tableCountCmd);
      
      const metadata = {
        fileName,
        filePath,
        fileSize: `${fileSize} MB`,
        checksum,
        type,
        tableCount: parseInt(tableCount.trim()),
        duration: `${duration}s`,
        createdAt: new Date().toISOString(),
        databaseUrl: config.database,
        host: config.host,
        method: 'pg_dump'
      };
      
      // Save metadata
      const metadataPath = filePath.replace(`.${extension}`, '-metadata.json');
      await fsPromises.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      
      this.logger.log(`Backup completed successfully: ${fileName} (${fileSize} MB)`);
      
      return {
        success: true,
        message: 'Professional backup created successfully',
        metadata
      };
      
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
      return {
        success: false,
        message: `Backup failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * List all available backups
   */
  async listBackups() {
    try {
      const files = await fsPromises.readdir(this.backupDir);
      const backups = [];
      
      for (const file of files) {
        if (file.includes('-metadata.json')) {
          try {
            const metadataPath = path.join(this.backupDir, file);
            const metadata = JSON.parse(await fsPromises.readFile(metadataPath, 'utf-8'));
            
            // Check if backup file still exists
            const backupExists = await fsPromises.access(metadata.filePath)
              .then(() => true)
              .catch(() => false);
            
            if (backupExists) {
              backups.push(metadata);
            }
          } catch (err) {
            this.logger.warn(`Failed to read metadata for ${file}: ${err.message}`);
          }
        }
      }
      
      // Sort by creation date (newest first)
      backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return {
        success: true,
        backups,
        count: backups.length
      };
      
    } catch (error) {
      this.logger.error(`Failed to list backups: ${error.message}`);
      return {
        success: false,
        backups: [],
        error: error.message
      };
    }
  }

  /**
   * Download a backup file
   */
  async getBackupFile(fileName: string) {
    try {
      const filePath = path.join(this.backupDir, fileName);
      
      // Security check - prevent directory traversal
      if (fileName.includes('..') || fileName.includes('/')) {
        throw new Error('Invalid filename');
      }
      
      // Check if file exists
      await fsPromises.access(filePath);
      
      return {
        success: true,
        filePath,
        fileName
      };
      
    } catch (error) {
      this.logger.error(`Failed to get backup file: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restore database from backup file
   */
  async restoreProfessionalBackup(fileName: string) {
    try {
      this.logger.log(`Starting professional PostgreSQL restore from ${fileName}...`);
      
      const filePath = path.join(this.backupDir, fileName);
      
      // Security check
      if (fileName.includes('..') || fileName.includes('/')) {
        throw new Error('Invalid filename');
      }
      
      // Check if file exists
      await fsPromises.access(filePath);
      
      // Parse connection string
      const databaseUrl = process.env.DATABASE_URL;
      const urlParts = new URL(databaseUrl);
      
      // Set environment variables for pg_restore
      const env = {
        ...process.env,
        PGHOST: urlParts.hostname,
        PGPORT: urlParts.port || '5432',
        PGUSER: urlParts.username,
        PGPASSWORD: urlParts.password,
        PGDATABASE: urlParts.pathname.slice(1),
      };
      
      const startTime = Date.now();
      
      // Determine restore command based on file type
      let restoreCommand: string;
      if (fileName.endsWith('.sql')) {
        // Plain SQL restore using psql with production options
        restoreCommand = `psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE --single-transaction --set ON_ERROR_STOP=1 -f "${filePath}"`;
      } else if (fileName.endsWith('.dump')) {
        // Custom format restore using pg_restore with production-grade options
        restoreCommand = `pg_restore -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE --jobs=4 --verbose --clean --if-exists --no-owner --no-privileges --disable-triggers "${filePath}"`;
      } else {
        throw new Error('Unsupported backup file format');
      }
      
      this.logger.log(`Executing restore command...`);
      const { stdout, stderr } = await execAsync(restoreCommand, { 
        env,
        maxBuffer: 100 * 1024 * 1024, // 100MB buffer
        timeout: 30 * 60 * 1000, // 30 minutes timeout
      });
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Log any warnings/errors
      if (stderr) {
        this.logger.warn(`Restore warnings: ${stderr}`);
      }
      
      const result = {
        success: true,
        fileName,
        duration: `${duration}s`,
        restoredAt: new Date().toISOString(),
        warnings: stderr || null,
      };
      
      this.logger.log(`Professional restore completed in ${duration}s`);
      return result;
      
    } catch (error) {
      this.logger.error(`Professional restore failed: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete old backups
   */
  async cleanupOldBackups(daysToKeep: number = 7) {
    try {
      const files = await fsPromises.readdir(this.backupDir);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;
      let deletedCount = 0;
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = await fsPromises.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fsPromises.unlink(filePath);
          deletedCount++;
          this.logger.log(`Deleted old backup: ${file}`);
        }
      }
      
      return {
        success: true,
        deletedCount,
        message: `Cleaned up ${deletedCount} old backups`
      };
      
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }
}