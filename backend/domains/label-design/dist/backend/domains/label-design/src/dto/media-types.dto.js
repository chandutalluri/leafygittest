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
exports.UpdateMediaTypeDto = exports.CreateMediaTypeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PhysicalPropertiesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label width in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "labelWidth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label height in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "labelHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page width in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "pageWidth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page height in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "pageHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of labels per row' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "labelsPerRow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of labels per column' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "labelsPerColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total labels per sheet' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "totalLabelsPerSheet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top margin in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "marginTop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Left margin in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "marginLeft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Right margin in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "marginRight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bottom margin in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "marginBottom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Horizontal spacing between labels in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "horizontalSpacing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vertical spacing between labels in mm' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhysicalPropertiesDto.prototype, "verticalSpacing", void 0);
class CreateMediaTypeDto {
}
exports.CreateMediaTypeDto = CreateMediaTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Media type name (e.g., "Avery 5160")' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMediaTypeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Manufacturer name (e.g., "Avery")' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMediaTypeDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product code (e.g., "5160", "L7160")' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMediaTypeDto.prototype, "productCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the media type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMediaTypeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Physical properties and dimensions' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PhysicalPropertiesDto),
    __metadata("design:type", PhysicalPropertiesDto)
], CreateMediaTypeDto.prototype, "physicalProperties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Media type', enum: ['sheet', 'roll'], default: 'sheet' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMediaTypeDto.prototype, "mediaType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page orientation', enum: ['portrait', 'landscape'], default: 'portrait' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMediaTypeDto.prototype, "orientation", void 0);
class UpdateMediaTypeDto {
}
exports.UpdateMediaTypeDto = UpdateMediaTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Media type name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTypeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Manufacturer name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTypeDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product code', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTypeDto.prototype, "productCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTypeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Physical properties and dimensions', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PhysicalPropertiesDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateMediaTypeDto.prototype, "physicalProperties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Media type', enum: ['sheet', 'roll'], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTypeDto.prototype, "mediaType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page orientation', enum: ['portrait', 'landscape'], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMediaTypeDto.prototype, "orientation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active status', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMediaTypeDto.prototype, "isActive", void 0);
//# sourceMappingURL=media-types.dto.js.map