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
exports.CustomTemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const minimal_template_service_1 = require("../services/minimal-template.service");
let CustomTemplateController = class CustomTemplateController {
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
        const sanitizedData = {
            name: templateData.name || 'Untitled Template',
            description: templateData.description || '',
            paperSize: templateData.paperSize || 'A4',
            paperWidth: templateData.paperWidth || 210.0,
            paperHeight: templateData.paperHeight || 297.0,
            labelWidth: templateData.labelWidth || 100.0,
            labelHeight: templateData.labelHeight || 50.0,
            horizontalCount: templateData.horizontalCount || 1,
            verticalCount: templateData.verticalCount || 1,
            marginTop: templateData.marginTop || 10.0,
            marginBottom: templateData.marginBottom || 10.0,
            marginLeft: templateData.marginLeft || 10.0,
            marginRight: templateData.marginRight || 10.0,
            horizontalGap: templateData.horizontalGap || 5.0,
            verticalGap: templateData.verticalGap || 5.0,
            cornerRadius: templateData.cornerRadius || 0.0,
            isActive: true,
            createdBy: templateData.createdBy || 1,
            companyId: templateData.companyId || 1,
            branchId: templateData.branchId || 1
        };
        return await this.minimalTemplateService.create(sanitizedData);
    }
    async update(id, updateData) {
        return await this.minimalTemplateService.update(id, updateData);
    }
    async remove(id) {
        return await this.minimalTemplateService.remove(id);
    }
};
exports.CustomTemplateController = CustomTemplateController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all custom templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom templates retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom template by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom template retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Custom template not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new custom template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Custom template created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update custom template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom template updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Custom template not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CustomTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete custom template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom template deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Custom template not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomTemplateController.prototype, "remove", null);
exports.CustomTemplateController = CustomTemplateController = __decorate([
    (0, common_1.Controller)('custom-templates'),
    (0, swagger_1.ApiTags)('Custom Template Management'),
    __metadata("design:paramtypes", [minimal_template_service_1.MinimalTemplateService])
], CustomTemplateController);
//# sourceMappingURL=custom-template.controller.js.map