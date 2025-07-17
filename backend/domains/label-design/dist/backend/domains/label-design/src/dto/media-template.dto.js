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
exports.UpdateMediaTemplateDto = exports.CreateMediaTemplateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class DimensionsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page width in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "pageWidth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page height in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "pageHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label width in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "labelWidth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label height in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "labelHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of columns' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of rows' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "rows", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top margin in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "marginTop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Left margin in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "marginLeft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Horizontal spacing in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "spacingX", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vertical spacing in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DimensionsDto.prototype, "spacingY", void 0);
class CreateMediaTemplateDto {
}
exports.CreateMediaTemplateDto = CreateMediaTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMediaTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template code (e.g., L7160)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMediaTemplateDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Manufacturer name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMediaTemplateDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMediaTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template dimensions' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DimensionsDto),
    __metadata("design:type", DimensionsDto)
], CreateMediaTemplateDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page orientation', enum: ['portrait', 'landscape'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMediaTemplateDto.prototype, "orientation", void 0);
class UpdateMediaTemplateDto {
}
exports.UpdateMediaTemplateDto = UpdateMediaTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template code', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTemplateDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Manufacturer name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTemplateDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template dimensions', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DimensionsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateMediaTemplateDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page orientation', enum: ['portrait', 'landscape'], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTemplateDto.prototype, "orientation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active status', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMediaTemplateDto.prototype, "isActive", void 0);
//# sourceMappingURL=media-template.dto.js.map