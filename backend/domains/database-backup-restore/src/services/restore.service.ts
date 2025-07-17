import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class RestoreService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  async startRestore(backupId: number, restoreType: string = 'full', createdBy: string = 'system'): Promise<string> {
    const client = await this.pool.connect();
    
    try {
      // Generate unique job ID
      const jobId = `restore-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      
      // Create restore job record
      const restoreJobQuery = `
        INSERT INTO restore_jobs (backup_id, status, restore_type, started_at, metadata)
        VALUES ($1, $2, $3, NOW(), $4)
        RETURNING id
      `;
      
      const metadata = {
        createdBy,
        jobId,
        restoreType,
        startTime: new Date().toISOString()
      };
      
      const result = await client.query(restoreJobQuery, [
        backupId,
        'pending',
        restoreType,
        JSON.stringify(metadata)
      ]);
      
      const restoreJobDbId = result.rows[0].id;
      
      // Start restore process asynchronously
      this.performRestore(restoreJobDbId, backupId, restoreType, jobId).catch(error => {
        console.error(`Restore job ${jobId} failed:`, error);
        this.updateRestoreJobStatus(restoreJobDbId, 'failed', error.message);
      });
      
      return jobId;
    } finally {
      client.release();
    }
  }

  private async performRestore(restoreJobId: number, backupId: number, restoreType: string, jobId: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      // Update status to running
      await this.updateRestoreJobStatus(restoreJobId, 'running');
      
      // Get backup file information
      const backupQuery = 'SELECT file_path, file_name FROM backup_jobs WHERE id = $1';
      const backupResult = await client.query(backupQuery, [backupId]);
      
      if (backupResult.rows.length === 0) {
        throw new Error('Backup not found');
      }
      
      const { file_path: filePath, file_name: fileName } = backupResult.rows[0];
      const backupFilePath = filePath || path.join(process.cwd(), 'backups', fileName);
      
      if (!fs.existsSync(backupFilePath)) {
        throw new Error('Backup file not found');
      }
      
      // Perform restore based on type
      await this.executeRestore(backupFilePath, restoreType);
      
      // Update status to completed
      await client.query(`
        UPDATE restore_jobs 
        SET status = $1, completed_at = NOW(), updated_at = NOW()
        WHERE id = $2
      `, ['completed', restoreJobId]);
      
    } catch (error) {
      await this.updateRestoreJobStatus(restoreJobId, 'failed', error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  private async executeRestore(backupFilePath: string, restoreType: string): Promise<void> {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    const restoreCommand = this.buildRestoreCommand(backupFilePath, restoreType, dbUrl);
    
    console.log(`Executing restore command: ${restoreCommand}`);
    
    try {
      const { stdout, stderr } = await execAsync(restoreCommand);
      
      if (stderr && !stderr.includes('NOTICE:')) {
        console.warn('Restore warnings:', stderr);
      }
      
      console.log('Restore completed successfully');
    } catch (error) {
      console.error('Restore execution failed:', error);
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  private buildRestoreCommand(backupFilePath: string, restoreType: string, dbUrl: URL): string {
    const baseCommand = `PGPASSWORD='${dbUrl.password}' psql -h ${dbUrl.hostname} -p ${dbUrl.port} -U ${dbUrl.username} -d ${dbUrl.pathname.slice(1)}`;
    
    switch (restoreType) {
      case 'schema_only':
        return `${baseCommand} --schema-only -f "${backupFilePath}"`;
      case 'data_only':
        return `${baseCommand} --data-only -f "${backupFilePath}"`;
      case 'full':
      default:
        return `${baseCommand} -f "${backupFilePath}"`;
    }
  }

  private async updateRestoreJobStatus(restoreJobId: number, status: string, errorMessage?: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      const updateQuery = `
        UPDATE restore_jobs 
        SET status = $1, error_message = $2, updated_at = NOW()
        ${status === 'completed' ? ', completed_at = NOW()' : ''}
        WHERE id = $3
      `;
      
      await client.query(updateQuery, [status, errorMessage || null, restoreJobId]);
    } finally {
      client.release();
    }
  }

  async getRestoreJob(jobId: string): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        SELECT 
          rj.*,
          bj.file_name as backup_file_name,
          bj.file_size as backup_file_size,
          bj.created_at as backup_created_at
        FROM restore_jobs rj
        JOIN backup_jobs bj ON rj.backup_id = bj.id
        WHERE rj.metadata->>'jobId' = $1
      `;
      
      const result = await client.query(query, [jobId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async getRestoreJobs(limit: number = 50): Promise<any[]> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        SELECT 
          rj.*,
          bj.file_name as backup_file_name,
          bj.file_size as backup_file_size,
          bj.created_at as backup_created_at
        FROM restore_jobs rj
        JOIN backup_jobs bj ON rj.backup_id = bj.id
        ORDER BY rj.created_at DESC
        LIMIT $1
      `;
      
      const result = await client.query(query, [limit]);
      return result.rows;
    } finally {
      client.release();
    }
  }
}