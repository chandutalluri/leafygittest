"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const backup_service_1 = require("./backup.service");
let SchedulerService = class SchedulerService {
    constructor(backupService) {
        this.backupService = backupService;
        this.activeCronJobs = new Map();
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });
        this.initializeSchedules();
    }
    async initializeSchedules() {
        try {
            const activeSchedules = await this.getActiveSchedules();
            for (const schedule of activeSchedules) {
                this.startCronJob(schedule);
            }
            console.log(`Initialized ${activeSchedules.length} backup schedules`);
        }
        catch (error) {
            console.error('Failed to initialize backup schedules:', error);
        }
    }
    async createSchedule(dto, createdBy) {
        const client = await this.pool.connect();
        try {
            if (!this.validateCronExpression(dto.cronExpression)) {
                throw new Error('Invalid cron expression');
            }
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
            if (schedule.is_active) {
                this.startCronJob(schedule);
            }
            return schedule;
        }
        finally {
            client.release();
        }
    }
    async getSchedules(limit = 50, activeOnly) {
        const client = await this.pool.connect();
        try {
            let query = 'SELECT * FROM backup_schedules';
            const params = [];
            if (activeOnly !== undefined) {
                query += ' WHERE is_active = $1';
                params.push(activeOnly);
            }
            query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
            params.push(limit);
            const result = await client.query(query, params);
            return result.rows;
        }
        finally {
            client.release();
        }
    }
    async getSchedule(scheduleId) {
        const client = await this.pool.connect();
        try {
            const query = 'SELECT * FROM backup_schedules WHERE id = $1';
            const result = await client.query(query, [scheduleId]);
            return result.rows[0] || null;
        }
        finally {
            client.release();
        }
    }
    async updateSchedule(scheduleId, dto, updatedBy) {
        const client = await this.pool.connect();
        try {
            const currentSchedule = await this.getSchedule(scheduleId);
            if (!currentSchedule) {
                throw new Error('Schedule not found');
            }
            if (dto.cronExpression && !this.validateCronExpression(dto.cronExpression)) {
                throw new Error('Invalid cron expression');
            }
            const updateFields = [];
            const params = [];
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
            this.stopCronJob(scheduleId);
            if (updatedSchedule.is_active) {
                this.startCronJob(updatedSchedule);
            }
            return updatedSchedule;
        }
        finally {
            client.release();
        }
    }
    async deleteSchedule(scheduleId, deletedBy) {
        const client = await this.pool.connect();
        try {
            this.stopCronJob(scheduleId);
            const query = 'DELETE FROM backup_schedules WHERE id = $1';
            await client.query(query, [scheduleId]);
        }
        finally {
            client.release();
        }
    }
    async toggleSchedule(scheduleId, updatedBy) {
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
            this.stopCronJob(scheduleId);
            if (schedule.is_active) {
                this.startCronJob(schedule);
            }
            return schedule;
        }
        finally {
            client.release();
        }
    }
    async getActiveSchedules() {
        const client = await this.pool.connect();
        try {
            const query = 'SELECT * FROM backup_schedules WHERE is_active = true';
            const result = await client.query(query);
            return result.rows;
        }
        finally {
            client.release();
        }
    }
    startCronJob(schedule) {
        try {
            console.log(`Schedule created: ${schedule.name} (cron execution will be available after installing node-cron)`);
            this.activeCronJobs.set(schedule.id, { schedule });
        }
        catch (error) {
            console.error(`Failed to register schedule ${schedule.id}:`, error);
        }
    }
    stopCronJob(scheduleId) {
        const task = this.activeCronJobs.get(scheduleId);
        if (task) {
            this.activeCronJobs.delete(scheduleId);
            console.log(`Removed schedule ID: ${scheduleId}`);
        }
    }
    validateCronExpression(expression) {
        const parts = expression.trim().split(/\s+/);
        if (parts.length !== 5)
            return false;
        return parts.every(part => {
            return /^(\*|[0-9]+(-[0-9]+)?(,[0-9]+(-[0-9]+)?)*)$/.test(part);
        });
    }
    getNextRunTime(cronExpression) {
        const now = new Date();
        const nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return nextRun;
    }
    async updateLastRunTime(scheduleId) {
        const client = await this.pool.connect();
        try {
            const query = `
        UPDATE backup_schedules 
        SET last_run_at = NOW(), updated_at = NOW()
        WHERE id = $1
      `;
            await client.query(query, [scheduleId]);
        }
        finally {
            client.release();
        }
    }
    async cleanupOldBackups(retentionDays) {
        const client = await this.pool.connect();
        try {
            const query = `
        DELETE FROM backup_jobs 
        WHERE created_at < NOW() - INTERVAL '${retentionDays} days'
        AND type = 'scheduled'
      `;
            const result = await client.query(query);
            console.log(`Cleaned up ${result.rowCount} old backup records`);
        }
        finally {
            client.release();
        }
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [backup_service_1.BackupService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map