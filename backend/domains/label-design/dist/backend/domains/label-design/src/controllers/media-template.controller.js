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
exports.MediaTemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const media_template_service_1 = require("../services/media-template.service");
const media_template_dto_1 = require("../dto/media-template.dto");
let MediaTemplateController = class MediaTemplateController {
    constructor(mediaTemplateService) {
        this.mediaTemplateService = mediaTemplateService;
    }
    async findAll(active) {
        const templates = await this.mediaTemplateService.findAll(active);
        return {
            success: true,
            data: templates
        };
    }
    async findOne(id) {
        const template = await this.mediaTemplateService.findOne(+id);
        return {
            success: true,
            data: template
        };
    }
    async create(createDto) {
        const template = await this.mediaTemplateService.create(createDto);
        return {
            success: true,
            data: template,
            message: 'Media template created successfully'
        };
    }
    async update(id, updateDto) {
        const template = await this.mediaTemplateService.update(+id, updateDto);
        return {
            success: true,
            data: template,
            message: 'Media template updated successfully'
        };
    }
    async remove(id) {
        await this.mediaTemplateService.delete(+id);
        return {
            success: true,
            message: 'Media template deleted successfully'
        };
    }
};
exports.MediaTemplateController = MediaTemplateController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all media templates' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'List of media templates' }),
    __param(0, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], MediaTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get media template by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Media template details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new media template' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Media template created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [media_template_dto_1.CreateMediaTemplateDto]),
    __metadata("design:returntype", Promise)
], MediaTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update media template' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Media template updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, media_template_dto_1.UpdateMediaTemplateDto]),
    __metadata("design:returntype", Promise)
], MediaTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete media template' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Media template deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaTemplateController.prototype, "remove", null);
exports.MediaTemplateController = MediaTemplateController = __decorate([
    (0, swagger_1.ApiTags)('Media Templates'),
    (0, common_1.Controller)('media-templates'),
    __metadata("design:paramtypes", [media_template_service_1.MediaTemplateService])
], MediaTemplateController);
//# sourceMappingURL=media-template.controller.js.map