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
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const gcs_service_1 = require("./gcs.service");
const professional_backup_service_1 = require("./professional-backup.service");
const db_1 = require("../../drizzle/db");
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let BackupService = BackupService_1 = class BackupService {
    constructor(gcsService) {
        this.gcsService = gcsService;
        this.logger = new common_1.Logger(BackupService_1.name);
        this.localBackupDir = '/tmp/backups';
        this.ensureBackupDirectory();
    }
    async ensureBackupDirectory() {
        try {
            await (0, promises_1.mkdir)(this.localBackupDir, { recursive: true });
        }
        catch (error) {
            this.logger.error(`Failed to create backup directory: ${error.message}`);
        }
    }
    async createBackup(type = 'manual', createdBy) {
        const jobId = this.generateJobId();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup-${timestamp}.backup`;
        const localPath = (0, path_1.join)(this.localBackupDir, fileName);
        const gcsPath = `db-backups/${fileName}`;
        await db_1.db.insert(schema_1.backupJobs).values({
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
            const professionalBackupService = new professional_backup_service_1.ProfessionalBackupService();
            const backupResult = await professionalBackupService.createProfessionalBackup('custom');
            if (!backupResult.success) {
                throw new Error(backupResult.error || 'Backup creation failed');
            }
            this.logger.log(`Professional backup created successfully: ${backupResult.metadata.fileName}`);
            const { metadata } = backupResult;
            let uploadUrl = '';
            const isGcsConfigured = await this.gcsService.isConfigured();
            const localPath = metadata.filePath;
            if (isGcsConfigured && localPath) {
                try {
                    uploadUrl = await this.gcsService.uploadBackup(localPath, gcsPath);
                    await (0, promises_1.unlink)(localPath);
                }
                catch (err) {
                    this.logger.warn(`GCS upload failed: ${err.message}`);
                }
            }
            else {
                this.logger.warn('GCS not configured, keeping backup locally');
            }
            await db_1.db.update(schema_1.backupJobs)
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
                .where((0, drizzle_orm_1.eq)(schema_1.backupJobs.jobId, jobId));
            this.logger.log(`Backup job ${jobId} completed successfully`);
            return jobId;
        }
        catch (error) {
            this.logger.error(`Backup job ${jobId} failed: ${error.message}`);
            await db_1.db.update(schema_1.backupJobs)
                .set({
                status: 'failed',
                error: error.message,
                completedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema_1.backupJobs.jobId, jobId));
            try {
                await (0, promises_1.unlink)(localPath);
            }
            catch { }
            throw error;
        }
    }
    async getBackupJobs(limit = 50) {
        return await db_1.db.select()
            .from(schema_1.backupJobs)
            .orderBy(schema_1.backupJobs.startedAt)
            .limit(limit);
    }
    async getBackupJob(jobId) {
        const jobs = await db_1.db.select()
            .from(schema_1.backupJobs)
            .where((0, drizzle_orm_1.eq)(schema_1.backupJobs.jobId, jobId))
            .limit(1);
        return jobs[0] || null;
    }
    async deleteBackup(jobId) {
        const job = await this.getBackupJob(jobId);
        if (!job) {
            throw new Error('Backup job not found');
        }
        try {
            if (job.gcsPath) {
                const isGcsConfigured = await this.gcsService.isConfigured();
                if (isGcsConfigured) {
                    await this.gcsService.deleteBackup(job.gcsPath);
                }
            }
            if (job.metadata?.localPath) {
                try {
                    await (0, promises_1.unlink)(job.metadata.localPath);
                }
                catch { }
            }
            await db_1.db.update(schema_1.backupJobs)
                .set({
                status: 'deleted',
                metadata: {
                    ...job.metadata,
                    deletedAt: new Date().toISOString(),
                }
            })
                .where((0, drizzle_orm_1.eq)(schema_1.backupJobs.jobId, jobId));
            this.logger.log(`Backup ${jobId} deleted successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to delete backup ${jobId}: ${error.message}`);
            throw error;
        }
    }
    generateJobId() {
        return `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async calculateChecksum(filePath) {
        const data = await (0, promises_1.readFile)(filePath);
        return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    async getBackupStats() {
        const jobs = await db_1.db.select().from(schema_1.backupJobs);
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
                stats.lastBackup = completedJobs.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
            }
        }
        return stats;
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gcs_service_1.GCSService])
], BackupService);
//# sourceMappingURL=backup.service.js.map