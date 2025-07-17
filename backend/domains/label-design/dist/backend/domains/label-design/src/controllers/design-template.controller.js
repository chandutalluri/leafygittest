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
exports.DesignTemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const design_template_service_1 = require("../services/design-template.service");
const design_template_dto_1 = require("../dto/design-template.dto");
let DesignTemplateController = class DesignTemplateController {
    constructor(designTemplateService) {
        this.designTemplateService = designTemplateService;
    }
    async findAll(active) {
        const templates = await this.designTemplateService.findAll(active);
        return {
            success: true,
            data: templates,
            message: 'Design templates retrieved successfully'
        };
    }
    async findOne(id) {
        const template = await this.designTemplateService.findOne(+id);
        return {
            success: true,
            data: template,
            message: 'Design template retrieved successfully'
        };
    }
    async create(createDto) {
        const template = await this.designTemplateService.create(createDto);
        return {
            success: true,
            data: template,
            message: 'Design template created successfully'
        };
    }
    async update(id, updateDto) {
        const template = await this.designTemplateService.update(+id, updateDto);
        return {
            success: true,
            data: template,
            message: 'Design template updated successfully'
        };
    }
    async remove(id) {
        await this.designTemplateService.delete(+id);
        return {
            success: true,
            message: 'Design template deleted successfully'
        };
    }
};
exports.DesignTemplateController = DesignTemplateController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all design templates (content layout)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'List of design templates with content layout' }),
    __param(0, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], DesignTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get design template by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Design template with content layout' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new design template (content layout)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Design template created with content layout' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [design_template_dto_1.CreateDesignTemplateDto]),
    __metadata("design:returntype", Promise)
], DesignTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update design template (content layout)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Design template updated with new content layout' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, design_template_dto_1.UpdateDesignTemplateDto]),
    __metadata("design:returntype", Promise)
], DesignTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete design template' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Design template deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignTemplateController.prototype, "remove", null);
exports.DesignTemplateController = DesignTemplateController = __decorate([
    (0, swagger_1.ApiTags)('Design Templates - Content Layout'),
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [design_template_service_1.DesignTemplateService])
], DesignTemplateController);
//# sourceMappingURL=design-template.controller.js.map