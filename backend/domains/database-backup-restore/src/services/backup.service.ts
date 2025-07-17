import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createHash } from 'crypto';
import { readFile, unlink, stat, mkdir } from 'fs/promises';
import { join } from 'path';
import { GCSService } from './gcs.service';
import { ProfessionalBackupService } from './professional-backup.service';
import { db } from '../../drizzle/db';
import { backupJobs } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly localBackupDir = '/tmp/backups';

  constructor(private readonly gcsService: GCSService) {
    this.ensureBackupDirectory();
  }

  private async ensureBackupDirectory() {
    try {
      await mkdir(this.localBackupDir, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create backup directory: ${error.message}`);
    }
  }

  async createBackup(type: string = 'manual', createdBy: string): Promise<string> {
    const jobId = this.generateJobId();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup-${timestamp}.backup`;
    const localPath = join(this.localBackupDir, fileName);
    const gcsPath = `db-backups/${fileName}`;

    // Insert job record
    await db.insert(backupJobs).values({
      jobId,
      type,
      status: 'running',
      fileName,
      gcsPath,
      createdBy,
      startedAt: new Date(),
    });

    try {
      this.logger.log(`Starting backup job ${jobId}`);

      // Use the professional backup service to create the actual backup
      // Use the professional backup service that's injected in the constructor
      const professionalBackupService = new ProfessionalBackupService();
      const backupResult = await professionalBackupService.createProfessionalBackup('custom');
      
      if (!backupResult.success) {
        throw new Error(backupResult.error || 'Backup creation failed');
      }
      
      this.logger.log(`Professional backup created successfully: ${backupResult.metadata.fileName}`);

      // Update job with successful backup details
      const { metadata } = backupResult;
      
      // Upload to GCS if configured
      let uploadUrl = '';
      const isGcsConfigured = await this.gcsService.isConfigured();
      const localPath = metadata.filePath;
      
      if (isGcsConfigured && localPath) {
        try {
          uploadUrl = await this.gcsService.uploadBackup(localPath, gcsPath);
          // Cleanup local file if uploaded to GCS
          await unlink(localPath);
        } catch (err) {
          this.logger.warn(`GCS upload failed: ${err.message}`);
        }
      } else {
        this.logger.warn('GCS not configured, keeping backup locally');
      }

      // Update job status with all details
      await db.update(backupJobs)
        .set({
          status: 'completed',
          fileName: metadata.fileName,
          fileSize: metadata.fileSize,
          checksum: metadata.checksum,
          completedAt: new Date(),
          metadata: {
            ...metadata,
            localPath: !isGcsConfigured ? localPath : null,
            uploadUrl,
          }
        })
        .where(eq(backupJobs.jobId, jobId));

      this.logger.log(`Backup job ${jobId} completed successfully`);
      return jobId;

    } catch (error) {
      this.logger.error(`Backup job ${jobId} failed: ${error.message}`);

      // Update job with error
      await db.update(backupJobs)
        .set({
          status: 'failed',
          error: error.message,
          completedAt: new Date(),
        })
        .where(eq(backupJobs.jobId, jobId));

      // Cleanup local file if exists
      try {
        await unlink(localPath);
      } catch {}

      throw error;
    }
  }

  async getBackupJobs(limit: number = 50): Promise<any[]> {
    return await db.select()
      .from(backupJobs)
      .orderBy(backupJobs.startedAt)
      .limit(limit);
  }

  async getBackupJob(jobId: string): Promise<any> {
    const jobs = await db.select()
      .from(backupJobs)
      .where(eq(backupJobs.jobId, jobId))
      .limit(1);
    
    return jobs[0] || null;
  }

  async deleteBackup(jobId: string): Promise<void> {
    const job = await this.getBackupJob(jobId);
    if (!job) {
      throw new Error('Backup job not found');
    }

    try {
      // Delete from GCS if exists
      if (job.gcsPath) {
        const isGcsConfigured = await this.gcsService.isConfigured();
        if (isGcsConfigured) {
          await this.gcsService.deleteBackup(job.gcsPath);
        }
      }

      // Delete local file if exists
      if (job.metadata?.localPath) {
        try {
          await unlink(job.metadata.localPath);
        } catch {}
      }

      // Update job status
      await db.update(backupJobs)
        .set({
          status: 'deleted',
          metadata: {
            ...job.metadata,
            deletedAt: new Date().toISOString(),
          }
        })
        .where(eq(backupJobs.jobId, jobId));

      this.logger.log(`Backup ${jobId} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete backup ${jobId}: ${error.message}`);
      throw error;
    }
  }

  private generateJobId(): string {
    return `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const data = await readFile(filePath);
    return createHash('sha256').update(data).digest('hex');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get backup statistics
  async getBackupStats(): Promise<any> {
    const jobs = await db.select().from(backupJobs);
    
    const stats = {
      total: jobs.length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      running: jobs.filter(j => j.status === 'running').length,
      totalSize: '0 B',
      lastBackup: null,
    };

    if (jobs.length > 0) {
      const completedJobs = jobs.filter(j => j.status === 'completed' && j.fileSize);
      if (completedJobs.length > 0) {
        // Sum up sizes (would need to parse the formatted sizes)
        stats.lastBackup = completedJobs.sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )[0];
      }
    }

    return stats;
  }
}