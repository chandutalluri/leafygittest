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
exports.ApplyPlaceholdersDto = exports.ExportPdfDto = exports.GenerateBatchDto = exports.GeneratePreviewDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ProductItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity of labels' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Custom data overrides', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ProductItemDto.prototype, "customData", void 0);
class GeneratePreviewDto {
}
exports.GeneratePreviewDto = GeneratePreviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GeneratePreviewDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GeneratePreviewDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Custom data for placeholders', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GeneratePreviewDto.prototype, "customData", void 0);
class GenerateBatchDto {
}
exports.GenerateBatchDto = GenerateBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GenerateBatchDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Media template ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GenerateBatchDto.prototype, "mediaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Products with quantities' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductItemDto),
    __metadata("design:type", Array)
], GenerateBatchDto.prototype, "products", void 0);
class ExportPdfDto extends GenerateBatchDto {
}
exports.ExportPdfDto = ExportPdfDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'PDF options', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ExportPdfDto.prototype, "pdfOptions", void 0);
class ApplyPlaceholdersDto {
}
exports.ApplyPlaceholdersDto = ApplyPlaceholdersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label elements' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ApplyPlaceholdersDto.prototype, "elements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product data for placeholders' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ApplyPlaceholdersDto.prototype, "productData", void 0);
//# sourceMappingURL=label-generation.dto.js.map