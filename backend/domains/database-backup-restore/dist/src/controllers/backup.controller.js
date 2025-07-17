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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const backup_service_1 = require("../services/backup.service");
const scheduler_service_1 = require("../services/scheduler.service");
const quick_backup_service_1 = require("../services/quick-backup.service");
const safe_backup_service_1 = require("../services/safe-backup.service");
const professional_backup_service_1 = require("../services/professional-backup.service");
const fs = require("fs");
const create_backup_dto_1 = require("../dto/create-backup.dto");
const backup_status_dto_1 = require("../dto/backup-status.dto");
const schedule_dto_1 = require("../dto/schedule.dto");
let BackupController = class BackupController {
    constructor(backupService, schedulerService, quickBackupService, safeBackupService, professionalBackupService) {
        this.backupService = backupService;
        this.schedulerService = schedulerService;
        this.quickBackupService = quickBackupService;
        this.safeBackupService = safeBackupService;
        this.professionalBackupService = professionalBackupService;
    }
    async createBackup(dto, req) {
        const createdBy = req.user?.id || 'system';
        const jobId = await this.backupService.createBackup(dto.type, createdBy);
        return {
            success: true,
            jobId,
            message: 'Backup job started',
        };
    }
    async getBackupJobs(query) {
        const jobs = await this.backupService.getBackupJobs(query.limit);
        return {
            success: true,
            data: jobs,
        };
    }
    async getBackupJob(jobId) {
        const job = await this.backupService.getBackupJob(jobId);
        if (!job) {
            throw new Error('Backup job not found');
        }
        return {
            success: true,
            data: job,
        };
    }
    async deleteBackup(jobId) {
        await this.backupService.deleteBackup(jobId);
        return {
            success: true,
            message: 'Backup deleted successfully',
        };
    }
    async getBackupStats() {
        const stats = await this.backupService.getBackupStats();
        return {
            success: true,
            data: stats,
        };
    }
    async createSchedule(dto) {
        const schedule = await this.schedulerService.createSchedule(dto, 'admin@leafyhealth.com');
        return {
            success: true,
            data: schedule,
        };
    }
    async getSchedules() {
        const schedules = await this.schedulerService.getSchedules();
        return {
            success: true,
            data: schedules,
        };
    }
    async updateSchedule(id, dto) {
        const schedule = await this.schedulerService.updateSchedule(id, dto, 'admin@leafyhealth.com');
        return {
            success: true,
            data: schedule,
        };
    }
    async deleteSchedule(id) {
        await this.schedulerService.deleteSchedule(id, 'admin@leafyhealth.com');
        return {
            success: true,
            message: 'Schedule deleted successfully',
        };
    }
    async createQuickBackup() {
        return await this.quickBackupService.createQuickBackup();
    }
    async createJsonExport() {
        return await this.quickBackupService.createJsonExport();
    }
    async createSafeBackup() {
        return this.safeBackupService.createSafeBackup();
    }
    async listSafeBackups() {
        return this.safeBackupService.listBackups();
    }
    async deleteSafeBackup(fileName) {
        const success = await this.safeBackupService.deleteBackup(fileName);
        return { success, message: success ? 'Backup deleted' : 'Failed to delete backup' };
    }
    async createProfessionalBackup(dto) {
        return await this.professionalBackupService.createProfessionalBackup(dto.type || 'custom');
    }
    async listProfessionalBackups() {
        return await this.professionalBackupService.listBackups();
    }
    async downloadProfessionalBackup(fileName, res) {
        const result = await this.professionalBackupService.getBackupFile(fileName);
        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }
        const file = fs.createReadStream(result.filePath);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${result.fileName}"`,
        });
        file.pipe(res);
    }
    async restoreProfessionalBackup(body) {
        return await this.professionalBackupService.restoreProfessionalBackup(body.fileName);
    }
    async cleanupProfessionalBackups(days) {
        return await this.professionalBackupService.cleanupOldBackups(days || 7);
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new backup' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Backup created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Super Admin only' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_backup_dto_1.CreateBackupDto, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of backup jobs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [backup_status_dto_1.BackupStatusDto]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific backup job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns backup job details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a backup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteBackup", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns backup statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupStats", null);
__decorate([
    (0, common_1.Post)('schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all backup schedules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of schedules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Post)('schedules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)('schedules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Post)('quick'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a quick data-only backup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quick backup created successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createQuickBackup", null);
__decorate([
    (0, common_1.Post)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export critical data as JSON' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data exported successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createJsonExport", null);
__decorate([
    (0, common_1.Post)('safe-backup'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a safe JSON backup that avoids connection pool issues' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createSafeBackup", null);
__decorate([
    (0, common_1.Get)('safe-backup/list'),
    (0, swagger_1.ApiOperation)({ summary: 'List available safe backups' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "listSafeBackups", null);
__decorate([
    (0, common_1.Delete)('safe-backup/:fileName'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a safe backup' }),
    __param(0, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteSafeBackup", null);
__decorate([
    (0, common_1.Post)('professional'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a professional PostgreSQL backup using pg_dump' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Professional backup created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createProfessionalBackup", null);
__decorate([
    (0, common_1.Get)('professional/list'),
    (0, swagger_1.ApiOperation)({ summary: 'List all professional backups' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of professional backups' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "listProfessionalBackups", null);
__decorate([
    (0, common_1.Get)('professional/download/:fileName'),
    (0, swagger_1.ApiOperation)({ summary: 'Download a professional backup file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns backup file for download' }),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "downloadProfessionalBackup", null);
__decorate([
    (0, common_1.Post)('professional/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore database from professional backup' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { fileName: { type: 'string', description: 'Backup file name to restore from' } } } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "restoreProfessionalBackup", null);
__decorate([
    (0, common_1.Delete)('professional/cleanup'),
    (0, swagger_1.ApiOperation)({ summary: 'Cleanup old professional backups' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Old backups cleaned up successfully' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "cleanupProfessionalBackups", null);
exports.BackupController = BackupController = __decorate([
    (0, swagger_1.ApiTags)('Backup Management'),
    (0, common_1.Controller)('backup'),
    __metadata("design:paramtypes", [backup_service_1.BackupService,
        scheduler_service_1.SchedulerService,
        quick_backup_service_1.QuickBackupService,
        safe_backup_service_1.SafeBackupService,
        professional_backup_service_1.ProfessionalBackupService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map