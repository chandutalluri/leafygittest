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
exports.MediaTypesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const media_types_service_1 = require("../services/media-types.service");
const media_types_dto_1 = require("../dto/media-types.dto");
let MediaTypesController = class MediaTypesController {
    constructor(mediaTypesService) {
        this.mediaTypesService = mediaTypesService;
    }
    async findAll(active) {
        const mediaTypes = await this.mediaTypesService.findAll(active);
        return {
            success: true,
            data: mediaTypes,
            message: 'Media types retrieved successfully'
        };
    }
    async findOne(id) {
        const mediaType = await this.mediaTypesService.findOne(+id);
        return {
            success: true,
            data: mediaType,
            message: 'Media type retrieved successfully'
        };
    }
    async create(createDto) {
        const mediaType = await this.mediaTypesService.create(createDto);
        return {
            success: true,
            data: mediaType,
            message: 'Media type created successfully'
        };
    }
    async update(id, updateDto) {
        const mediaType = await this.mediaTypesService.update(+id, updateDto);
        return {
            success: true,
            data: mediaType,
            message: 'Media type updated successfully'
        };
    }
    async remove(id) {
        const result = await this.mediaTypesService.update(+id, { isActive: false });
        return {
            success: true,
            message: 'Media type deleted successfully',
            data: result
        };
    }
};
exports.MediaTypesController = MediaTypesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all media types (physical properties)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'List of media types with physical dimensions' }),
    __param(0, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], MediaTypesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get media type by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Media type with physical dimensions' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaTypesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new media type (physical properties)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Media type created with physical dimensions' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [media_types_dto_1.CreateMediaTypeDto]),
    __metadata("design:returntype", Promise)
], MediaTypesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update media type (physical properties)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Media type updated with new physical dimensions' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, media_types_dto_1.UpdateMediaTypeDto]),
    __metadata("design:returntype", Promise)
], MediaTypesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete media type (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Media type deactivated' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaTypesController.prototype, "remove", null);
exports.MediaTypesController = MediaTypesController = __decorate([
    (0, swagger_1.ApiTags)('Media Types - Physical Properties'),
    (0, common_1.Controller)('media-types'),
    __metadata("design:paramtypes", [media_types_service_1.MediaTypesService])
], MediaTypesController);
//# sourceMappingURL=media-types.controller.js.map