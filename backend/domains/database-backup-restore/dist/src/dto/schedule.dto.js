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
exports.ScheduleStatusDto = exports.UpdateScheduleDto = exports.CreateScheduleDto = exports.BackupType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var BackupType;
(function (BackupType) {
    BackupType["FULL"] = "full";
    BackupType["SCHEMA_ONLY"] = "schema_only";
    BackupType["DATA_ONLY"] = "data_only";
    BackupType["CUSTOM"] = "custom";
})(BackupType || (exports.BackupType = BackupType = {}));
class CreateScheduleDto {
    constructor() {
        this.backupType = BackupType.FULL;
        this.retentionDays = 30;
        this.isActive = true;
    }
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Schedule name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cron expression for schedule timing',
        example: '0 2 * * *'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(\*|[0-5]?\d) (\*|1?\d|2[0-3]) (\*|[12]?\d|3[01]) (\*|[1-9]|1[012]) (\*|[0-6])$/, {
        message: 'Invalid cron expression format'
    }),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of backup to perform',
        enum: BackupType,
        default: BackupType.FULL
    }),
    (0, class_validator_1.IsEnum)(BackupType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "backupType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of days to retain backups', default: 30 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "retentionDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether schedule is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateScheduleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Custom tables to backup (for custom backup type)', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateScheduleDto.prototype, "customTables", void 0);
class UpdateScheduleDto {
}
exports.UpdateScheduleDto = UpdateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Schedule name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cron expression for schedule timing',
        example: '0 2 * * *',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(\*|[0-5]?\d) (\*|1?\d|2[0-3]) (\*|[12]?\d|3[01]) (\*|[1-9]|1[012]) (\*|[0-6])$/, {
        message: 'Invalid cron expression format'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of backup to perform',
        enum: BackupType,
        required: false
    }),
    (0, class_validator_1.IsEnum)(BackupType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "backupType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of days to retain backups', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateScheduleDto.prototype, "retentionDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether schedule is active', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateScheduleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Custom tables to backup (for custom backup type)', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateScheduleDto.prototype, "customTables", void 0);
class ScheduleStatusDto {
    constructor() {
        this.limit = 50;
    }
}
exports.ScheduleStatusDto = ScheduleStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Limit number of results', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ScheduleStatusDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by active status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ScheduleStatusDto.prototype, "active", void 0);
//# sourceMappingURL=schedule.dto.js.map