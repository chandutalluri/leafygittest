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
exports.MinimalTemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const minimal_template_service_1 = require("../services/minimal-template.service");
let MinimalTemplateController = class MinimalTemplateController {
    constructor(minimalTemplateService) {
        this.minimalTemplateService = minimalTemplateService;
    }
    async findAll() {
        return await this.minimalTemplateService.findAll();
    }
    async findOne(id) {
        return await this.minimalTemplateService.findOne(id);
    }
    async create(templateData) {
        return await this.minimalTemplateService.create(templateData);
    }
    async update(id, updateData) {
        return await this.minimalTemplateService.update(id, updateData);
    }
    async remove(id) {
        return await this.minimalTemplateService.remove(id);
    }
};
exports.MinimalTemplateController = MinimalTemplateController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Templates retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MinimalTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MinimalTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MinimalTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MinimalTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MinimalTemplateController.prototype, "remove", null);
exports.MinimalTemplateController = MinimalTemplateController = __decorate([
    (0, common_1.Controller)('templates'),
    (0, swagger_1.ApiTags)('Template Management'),
    __metadata("design:paramtypes", [minimal_template_service_1.MinimalTemplateService])
], MinimalTemplateController);
//# sourceMappingURL=minimal-template.controller.js.map