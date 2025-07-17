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
exports.UpdateDesignTemplateDto = exports.CreateDesignTemplateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDesignTemplateDto {
}
exports.CreateDesignTemplateDto = CreateDesignTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDesignTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDesignTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template category (e.g., "product_label", "price_tag")' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDesignTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Media type ID (references the physical label dimensions)' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDesignTemplateDto.prototype, "mediaTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template design data (QR codes, text fields, product fields, etc.)',
        type: 'object',
        additionalProperties: true,
        example: {
            elements: [
                {
                    type: 'text',
                    content: '${product.name}',
                    position: { x: 10, y: 10 },
                    fontSize: 12,
                    fontFamily: 'Arial'
                },
                {
                    type: 'qr',
                    content: '${product.url}',
                    position: { x: 200, y: 10 },
                    size: 50
                },
                {
                    type: 'barcode',
                    content: '${product.barcode}',
                    position: { x: 10, y: 100 },
                    format: 'CODE128'
                }
            ]
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDesignTemplateDto.prototype, "templateData", void 0);
class UpdateDesignTemplateDto {
}
exports.UpdateDesignTemplateDto = UpdateDesignTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDesignTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDesignTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template category', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDesignTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Media type ID', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDesignTemplateDto.prototype, "mediaTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template design data', type: 'object', additionalProperties: true }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDesignTemplateDto.prototype, "templateData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active status', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDesignTemplateDto.prototype, "isActive", void 0);
//# sourceMappingURL=design-template.dto.js.map