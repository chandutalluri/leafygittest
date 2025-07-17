import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
import { promises as fs } from 'fs';
import { createHash } from 'crypto';

@Injectable()
export class QuickBackupService {
  private readonly logger = new Logger(QuickBackupService.name);
  private readonly backupDir = join(process.cwd(), 'backups');

  constructor() {
    this.ensureBackupDir();
  }

  private async ensureBackupDir() {
    await fs.mkdir(this.backupDir, { recursive: true });
  }

  /**
   * Creates a quick backup using pg_dump --data-only for faster backup
   * This excludes schema and focuses only on data
   */
  async createQuickBackup(): Promise<{success: boolean, message: string, file?: string}> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `quick-backup-${timestamp}.sql`;
      const filePath = join(this.backupDir, fileName);

      // Parse DATABASE_URL
      const dbUrl = new URL(process.env.DATABASE_URL!);
      
      this.logger.log('Starting quick data-only backup...');

      // Use pg_dump with data-only flag for faster backup
      const result = await new Promise<{success: boolean, error?: string}>((resolve) => {
        const pgDump = spawn('pg_dump', [
          dbUrl.toString(),
          '--data-only',           // Only backup data, not schema
          '--no-owner',            // Don't include ownership
          '--no-privileges',       // Don't include privileges
          '--exclude-table=sessions', // Skip session table
          '--exclude-table=logs',     // Skip logs
          '--exclude-table=backup_jobs', // Skip backup history
          '--exclude-table=restore_jobs', // Skip restore history
          '--file=' + filePath,
        ], {
          timeout: 60000, // 1 minute timeout for quick backup
        });

        let stderr = '';

        pgDump.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        pgDump.on('error', (error) => {
          this.logger.error('pg_dump error:', error);
          resolve({ success: false, error: error.message });
        });

        pgDump.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: stderr || `Exit code ${code}` });
          }
        });
      });

      if (!result.success) {
        throw new Error(result.error || 'Backup failed');
      }

      // Get file size
      const stats = await fs.stat(filePath);
      const fileSize = this.formatBytes(stats.size);

      this.logger.log(`Quick backup completed: ${fileName} (${fileSize})`);

      return {
        success: true,
        message: `Quick backup created successfully`,
        file: fileName
      };

    } catch (error) {
      this.logger.error('Quick backup failed:', error);
      return {
        success: false,
        message: `Quick backup failed: ${error.message}`
      };
    }
  }

  /**
   * Creates an export of critical business data in JSON format
   * This is much faster and doesn't interfere with connections
   */
  async createJsonExport(): Promise<{success: boolean, message: string, file?: string}> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `data-export-${timestamp}.json`;
      const filePath = join(this.backupDir, fileName);

      this.logger.log('Starting JSON data export...');

      // Use the Drizzle connection to export data
      const { db } = require('../../drizzle/db');
      const schema = require('@shared/schema');

      const exportData: any = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        tables: {}
      };

      // Export critical tables
      const tablesToExport = [
        'users',
        'companies', 
        'branches',
        'categories',
        'products',
        'inventory',
        'customers',
        'orders',
        'order_items'
      ];

      for (const tableName of tablesToExport) {
        try {
          if (schema[tableName]) {
            const data = await db.select().from(schema[tableName]);
            exportData.tables[tableName] = data;
            this.logger.log(`Exported ${data.length} records from ${tableName}`);
          }
        } catch (err) {
          this.logger.warn(`Could not export ${tableName}: ${err.message}`);
        }
      }

      // Write JSON file
      await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));

      // Get file size
      const stats = await fs.stat(filePath);
      const fileSize = this.formatBytes(stats.size);

      this.logger.log(`JSON export completed: ${fileName} (${fileSize})`);

      return {
        success: true,
        message: `Data export created successfully`,
        file: fileName
      };

    } catch (error) {
      this.logger.error('JSON export failed:', error);
      return {
        success: false,
        message: `Export failed: ${error.message}`
      };
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}