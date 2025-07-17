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
exports.ScheduleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scheduler_service_1 = require("../services/scheduler.service");
const schedule_dto_1 = require("../dto/schedule.dto");
let ScheduleController = class ScheduleController {
    constructor(schedulerService) {
        this.schedulerService = schedulerService;
    }
    async createSchedule(dto, req) {
        const createdBy = req.user?.id || 'system';
        const schedule = await this.schedulerService.createSchedule(dto, createdBy);
        return {
            success: true,
            data: schedule,
            message: 'Backup schedule created successfully',
        };
    }
    async getSchedules(query) {
        const schedules = await this.schedulerService.getSchedules(query.limit, query.active);
        return {
            success: true,
            data: schedules,
        };
    }
    async getSchedule(scheduleId) {
        const schedule = await this.schedulerService.getSchedule(parseInt(scheduleId));
        if (!schedule) {
            throw new Error('Backup schedule not found');
        }
        return {
            success: true,
            data: schedule,
        };
    }
    async updateSchedule(scheduleId, dto, req) {
        const updatedBy = req.user?.id || 'system';
        const schedule = await this.schedulerService.updateSchedule(parseInt(scheduleId), dto, updatedBy);
        return {
            success: true,
            data: schedule,
            message: 'Backup schedule updated successfully',
        };
    }
    async deleteSchedule(scheduleId, req) {
        const deletedBy = req.user?.id || 'system';
        await this.schedulerService.deleteSchedule(parseInt(scheduleId), deletedBy);
        return {
            success: true,
            message: 'Backup schedule deleted successfully',
        };
    }
    async toggleSchedule(scheduleId, req) {
        const updatedBy = req.user?.id || 'system';
        const schedule = await this.schedulerService.toggleSchedule(parseInt(scheduleId), updatedBy);
        return {
            success: true,
            data: schedule,
            message: `Schedule ${schedule.is_active ? 'activated' : 'deactivated'} successfully`,
        };
    }
};
exports.ScheduleController = ScheduleController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Super Admin only' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CreateScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'List backup schedules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of backup schedules' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.ScheduleStatusDto]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Get)(':scheduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns backup schedule details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schedule not found' }),
    __param(0, (0, common_1.Param)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Put)(':scheduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schedule not found' }),
    __param(0, (0, common_1.Param)('scheduleId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.UpdateScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)(':scheduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schedule not found' }),
    __param(0, (0, common_1.Param)('scheduleId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Post)(':scheduleId/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle schedule active status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule status toggled successfully' }),
    __param(0, (0, common_1.Param)('scheduleId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "toggleSchedule", null);
exports.ScheduleController = ScheduleController = __decorate([
    (0, swagger_1.ApiTags)('Schedule Management'),
    (0, common_1.Controller)('schedule'),
    __metadata("design:paramtypes", [scheduler_service_1.SchedulerService])
], ScheduleController);
//# sourceMappingURL=schedule.controller.js.map