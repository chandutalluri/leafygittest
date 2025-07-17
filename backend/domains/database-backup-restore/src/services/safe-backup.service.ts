import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class SafeBackupService {
  private readonly logger = new Logger(SafeBackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups');

  constructor() {
    this.ensureBackupDir();
  }

  private ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Create a JSON backup of critical data
   * This avoids pg_dump crashes and connection pool issues
   */
  async createSafeBackup(): Promise<{ success: boolean; message: string; metadata?: any }> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `safe-json-backup-${timestamp}.json`;
    const filePath = path.join(this.backupDir, fileName);
    
    // Create a separate connection pool for backup
    const backupPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1, // Use only 1 connection to minimize impact
      connectionTimeoutMillis: 5000,
    });

    try {
      this.logger.log('Starting safe JSON backup...');
      const startTime = Date.now();

      const backupData: any = {
        metadata: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          type: 'safe-json-backup',
        },
        data: {},
      };

      // List of critical tables to backup
      const criticalTables = [
        'users',
        'companies',
        'branches',
        'categories',
        'products',
        'inventory',
        'customers',
        'orders',
        'order_items',
        'settings',
        'custom_template_dimensions',
        'custom_templates',
      ];

      // Backup each table
      for (const table of criticalTables) {
        try {
          const result = await backupPool.query(`SELECT * FROM ${table}`);
          backupData.data[table] = result.rows;
          this.logger.log(`Backed up ${result.rows.length} rows from ${table}`);
        } catch (error) {
          this.logger.warn(`Skipping table ${table}: ${error.message}`);
        }
      }

      // Write backup to file
      const jsonContent = JSON.stringify(backupData, null, 2);
      fs.writeFileSync(filePath, jsonContent);

      // Calculate file size and checksum
      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / 1024).toFixed(2) + ' KB';
      const checksum = crypto
        .createHash('sha256')
        .update(jsonContent)
        .digest('hex')
        .substring(0, 16);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      const metadata = {
        fileName,
        filePath,
        size: fileSize,
        checksum,
        tableCount: Object.keys(backupData.data).length,
        totalRows: Object.values(backupData.data).reduce(
          (sum: number, rows: any[]) => sum + rows.length,
          0
        ),
        duration: `${duration}s`,
        createdAt: new Date().toISOString(),
      };

      // Save metadata
      const metadataPath = filePath.replace('.json', '-metadata.json');
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      this.logger.log(`Safe backup completed: ${fileName}`);

      return {
        success: true,
        message: `Backup completed successfully in ${duration}s`,
        metadata,
      };
    } catch (error) {
      this.logger.error('Safe backup failed:', error);
      return {
        success: false,
        message: `Backup failed: ${error.message}`,
      };
    } finally {
      // Always close the backup connection pool
      await backupPool.end();
    }
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<any[]> {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backups = [];

      for (const file of files) {
        if (file.endsWith('-metadata.json')) {
          const metadataPath = path.join(this.backupDir, file);
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
          backups.push(metadata);
        }
      }

      return backups.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      this.logger.error('Error listing backups:', error);
      return [];
    }
  }

  /**
   * Delete a backup
   */
  async deleteBackup(fileName: string): Promise<boolean> {
    try {
      const filePath = path.join(this.backupDir, fileName);
      const metadataPath = filePath.replace('.json', '-metadata.json');

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      if (fs.existsSync(metadataPath)) {
        fs.unlinkSync(metadataPath);
      }

      this.logger.log(`Deleted backup: ${fileName}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting backup: ${error.message}`);
      return false;
    }
  }
}