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
exports.RestoreService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let RestoreService = class RestoreService {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });
    }
    async startRestore(backupId, restoreType = 'full', createdBy = 'system') {
        const client = await this.pool.connect();
        try {
            const jobId = `restore-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
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
            this.performRestore(restoreJobDbId, backupId, restoreType, jobId).catch(error => {
                console.error(`Restore job ${jobId} failed:`, error);
                this.updateRestoreJobStatus(restoreJobDbId, 'failed', error.message);
            });
            return jobId;
        }
        finally {
            client.release();
        }
    }
    async performRestore(restoreJobId, backupId, restoreType, jobId) {
        const client = await this.pool.connect();
        try {
            await this.updateRestoreJobStatus(restoreJobId, 'running');
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
            await this.executeRestore(backupFilePath, restoreType);
            await client.query(`
        UPDATE restore_jobs 
        SET status = $1, completed_at = NOW(), updated_at = NOW()
        WHERE id = $2
      `, ['completed', restoreJobId]);
        }
        catch (error) {
            await this.updateRestoreJobStatus(restoreJobId, 'failed', error.message);
            throw error;
        }
        finally {
            client.release();
        }
    }
    async executeRestore(backupFilePath, restoreType) {
        const dbUrl = new URL(process.env.DATABASE_URL);
        const restoreCommand = this.buildRestoreCommand(backupFilePath, restoreType, dbUrl);
        console.log(`Executing restore command: ${restoreCommand}`);
        try {
            const { stdout, stderr } = await execAsync(restoreCommand);
            if (stderr && !stderr.includes('NOTICE:')) {
                console.warn('Restore warnings:', stderr);
            }
            console.log('Restore completed successfully');
        }
        catch (error) {
            console.error('Restore execution failed:', error);
            throw new Error(`Restore failed: ${error.message}`);
        }
    }
    buildRestoreCommand(backupFilePath, restoreType, dbUrl) {
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
    async updateRestoreJobStatus(restoreJobId, status, errorMessage) {
        const client = await this.pool.connect();
        try {
            const updateQuery = `
        UPDATE restore_jobs 
        SET status = $1, error_message = $2, updated_at = NOW()
        ${status === 'completed' ? ', completed_at = NOW()' : ''}
        WHERE id = $3
      `;
            await client.query(updateQuery, [status, errorMessage || null, restoreJobId]);
        }
        finally {
            client.release();
        }
    }
    async getRestoreJob(jobId) {
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
        }
        finally {
            client.release();
        }
    }
    async getRestoreJobs(limit = 50) {
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
        }
        finally {
            client.release();
        }
    }
};
exports.RestoreService = RestoreService;
exports.RestoreService = RestoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RestoreService);
//# sourceMappingURL=restore.service.js.map