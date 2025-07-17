import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
// import * as cron from 'node-cron'; // Temporarily disabled until dependency is resolved
import { BackupService } from './backup.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class SchedulerService {
  private pool: Pool;
  private activeCronJobs: Map<number, any> = new Map(); // Simplified for now

  constructor(private readonly backupService: BackupService) {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    // Initialize existing schedules on startup
    this.initializeSchedules();
  }

  private async initializeSchedules(): Promise<void> {
    try {
      const activeSchedules = await this.getActiveSchedules();
      
      for (const schedule of activeSchedules) {
        this.startCronJob(schedule);
      }
      
      console.log(`Initialized ${activeSchedules.length} backup schedules`);
    } catch (error) {
      console.error('Failed to initialize backup schedules:', error);
    }
  }

  async createSchedule(dto: CreateScheduleDto, createdBy: string): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      // Validate cron expression (simplified validation)
      if (!this.validateCronExpression(dto.cronExpression)) {
        throw new Error('Invalid cron expression');
      }

      // Calculate next run time
      const nextRunAt = this.getNextRunTime(dto.cronExpression);
      
      const query = `
        INSERT INTO backup_schedules (
          name, cron_expression, backup_type, retention_days, is_active, next_run_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const result = await client.query(query, [
        dto.name,
        dto.cronExpression,
        dto.backupType || 'full',
        dto.retentionDays || 30,
        dto.isActive !== false,
        nextRunAt
      ]);
      
      const schedule = result.rows[0];
      
      // Start cron job if active
      if (schedule.is_active) {
        this.startCronJob(schedule);
      }
      
      return schedule;
    } finally {
      client.release();
    }
  }

  async getSchedules(limit: number = 50, activeOnly?: boolean): Promise<any[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM backup_schedules';
      const params: any[] = [];
      
      if (activeOnly !== undefined) {
        query += ' WHERE is_active = $1';
        params.push(activeOnly);
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
      params.push(limit);
      
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getSchedule(scheduleId: number): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM backup_schedules WHERE id = $1';
      const result = await client.query(query, [scheduleId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async updateSchedule(scheduleId: number, dto: UpdateScheduleDto, updatedBy: string): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      // Get current schedule
      const currentSchedule = await this.getSchedule(scheduleId);
      if (!currentSchedule) {
        throw new Error('Schedule not found');
      }

      // Validate cron expression if provided
      if (dto.cronExpression && !this.validateCronExpression(dto.cronExpression)) {
        throw new Error('Invalid cron expression');
      }

      // Build update query
      const updateFields: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (dto.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        params.push(dto.name);
      }

      if (dto.cronExpression !== undefined) {
        updateFields.push(`cron_expression = $${paramIndex++}`, `next_run_at = $${paramIndex++}`);
        params.push(dto.cronExpression, this.getNextRunTime(dto.cronExpression));
      }

      if (dto.backupType !== undefined) {
        updateFields.push(`backup_type = $${paramIndex++}`);
        params.push(dto.backupType);
      }

      if (dto.retentionDays !== undefined) {
        updateFields.push(`retention_days = $${paramIndex++}`);
        params.push(dto.retentionDays);
      }

      if (dto.isActive !== undefined) {
        updateFields.push(`is_active = $${paramIndex++}`);
        params.push(dto.isActive);
      }

      updateFields.push(`updated_at = NOW()`);
      params.push(scheduleId);

      const query = `
        UPDATE backup_schedules 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, params);
      const updatedSchedule = result.rows[0];

      // Update cron job
      this.stopCronJob(scheduleId);
      if (updatedSchedule.is_active) {
        this.startCronJob(updatedSchedule);
      }

      return updatedSchedule;
    } finally {
      client.release();
    }
  }

  async deleteSchedule(scheduleId: number, deletedBy: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      // Stop cron job
      this.stopCronJob(scheduleId);
      
      // Delete from database
      const query = 'DELETE FROM backup_schedules WHERE id = $1';
      await client.query(query, [scheduleId]);
    } finally {
      client.release();
    }
  }

  async toggleSchedule(scheduleId: number, updatedBy: string): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        UPDATE backup_schedules 
        SET is_active = NOT is_active, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await client.query(query, [scheduleId]);
      const schedule = result.rows[0];

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      // Update cron job
      this.stopCronJob(scheduleId);
      if (schedule.is_active) {
        this.startCronJob(schedule);
      }

      return schedule;
    } finally {
      client.release();
    }
  }

  private async getActiveSchedules(): Promise<any[]> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM backup_schedules WHERE is_active = true';
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }

  private startCronJob(schedule: any): void {
    try {
      console.log(`Schedule created: ${schedule.name} (cron execution will be available after installing node-cron)`);
      // Store schedule for when cron functionality is enabled
      this.activeCronJobs.set(schedule.id, { schedule });
    } catch (error) {
      console.error(`Failed to register schedule ${schedule.id}:`, error);
    }
  }

  private stopCronJob(scheduleId: number): void {
    const task = this.activeCronJobs.get(scheduleId);
    if (task) {
      this.activeCronJobs.delete(scheduleId);
      console.log(`Removed schedule ID: ${scheduleId}`);
    }
  }

  private validateCronExpression(expression: string): boolean {
    // Basic cron expression validation (5 fields)
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) return false;
    
    // Very basic validation - each part should be * or a number or range
    return parts.every(part => {
      return /^(\*|[0-9]+(-[0-9]+)?(,[0-9]+(-[0-9]+)?)*)$/.test(part);
    });
  }

  private getNextRunTime(cronExpression: string): Date {
    // This is a simplified calculation - in production, use a proper cron parser
    const now = new Date();
    const nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to 24 hours from now
    return nextRun;
  }

  private async updateLastRunTime(scheduleId: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        UPDATE backup_schedules 
        SET last_run_at = NOW(), updated_at = NOW()
        WHERE id = $1
      `;
      
      await client.query(query, [scheduleId]);
    } finally {
      client.release();
    }
  }

  private async cleanupOldBackups(retentionDays: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        DELETE FROM backup_jobs 
        WHERE created_at < NOW() - INTERVAL '${retentionDays} days'
        AND type = 'scheduled'
      `;
      
      const result = await client.query(query);
      console.log(`Cleaned up ${result.rowCount} old backup records`);
    } finally {
      client.release();
    }
  }
}