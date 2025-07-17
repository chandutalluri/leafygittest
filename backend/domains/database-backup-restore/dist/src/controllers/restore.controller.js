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
exports.RestoreController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const restore_service_1 = require("../services/restore.service");
const restore_dto_1 = require("../dto/restore.dto");
let RestoreController = class RestoreController {
    constructor(restoreService) {
        this.restoreService = restoreService;
    }
    async startRestore(dto, req) {
        const createdBy = req.user?.id || 'system';
        const jobId = await this.restoreService.startRestore(dto.backupId, dto.restoreType, createdBy);
        return {
            success: true,
            jobId,
            message: 'Restore operation started',
        };
    }
    async getRestoreStatus(jobId) {
        const job = await this.restoreService.getRestoreJob(jobId);
        if (!job) {
            throw new Error('Restore job not found');
        }
        return {
            success: true,
            data: job,
        };
    }
    async getRestoreJobs(query) {
        const jobs = await this.restoreService.getRestoreJobs(query.limit);
        return {
            success: true,
            data: jobs,
        };
    }
};
exports.RestoreController = RestoreController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start restore operation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Restore operation started' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Super Admin only' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restore_dto_1.CreateRestoreDto, Object]),
    __metadata("design:returntype", Promise)
], RestoreController.prototype, "startRestore", null);
__decorate([
    (0, common_1.Get)('status/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get restore job status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns restore job status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestoreController.prototype, "getRestoreStatus", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'List restore jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of restore jobs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restore_dto_1.RestoreStatusDto]),
    __metadata("design:returntype", Promise)
], RestoreController.prototype, "getRestoreJobs", null);
exports.RestoreController = RestoreController = __decorate([
    (0, swagger_1.ApiTags)('Restore Management'),
    (0, common_1.Controller)('restore'),
    __metadata("design:paramtypes", [restore_service_1.RestoreService])
], RestoreController);
//# sourceMappingURL=restore.controller.js.map