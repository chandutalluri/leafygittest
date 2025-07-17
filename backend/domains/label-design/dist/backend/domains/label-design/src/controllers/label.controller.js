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
exports.LabelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const label_service_1 = require("../services/label.service");
const create_label_dto_1 = require("../dto/create-label.dto");
const print_label_dto_1 = require("../dto/print-label.dto");
let LabelController = class LabelController {
    constructor(labelService) {
        this.labelService = labelService;
    }
    async getMediaTypes() {
        return this.labelService.getMediaTypes();
    }
    async getMediaTypeById(id) {
        return this.labelService.getMediaTypeById(id);
    }
    async getTemplates(type, mediaId, branchId) {
        return this.labelService.getTemplates({ type, mediaId, branchId });
    }
    async getTemplateById(id) {
        return this.labelService.getTemplateById(id);
    }
    async createTemplate(templateDto) {
        return this.labelService.createTemplate(templateDto);
    }
    async generateLabelPreview(templateId, productId, branchId) {
        if (!templateId || !productId) {
            throw new common_1.HttpException('templateId and productId are required', common_1.HttpStatus.BAD_REQUEST);
        }
        const numericTemplateId = parseInt(templateId, 10);
        const numericProductId = parseInt(productId, 10);
        const numericBranchId = branchId ? parseInt(branchId, 10) : undefined;
        if (isNaN(numericTemplateId) || isNaN(numericProductId)) {
            throw new common_1.HttpException('templateId and productId must be valid numbers', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.labelService.generateLabelPreview(numericTemplateId, numericProductId, numericBranchId);
    }
    async generateBatchPreview(batchDto) {
        return this.labelService.generateBatchPreview(batchDto.templateId, batchDto.productIds, batchDto.branchId);
    }
    async printLabels(printDto) {
        return this.labelService.printLabels(printDto);
    }
    async getPrintJobs(branchId, status, limit) {
        return this.labelService.getPrintJobs({ branchId, status, limit });
    }
    async getPrintJobDetails(jobId) {
        return this.labelService.getPrintJobDetails(jobId);
    }
    async downloadPrintJob(jobId, res) {
        const file = await this.labelService.downloadPrintJobFile(jobId);
        res.set({
            'Content-Type': file.mimeType,
            'Content-Disposition': `attachment; filename="${file.filename}"`,
        });
        return new common_1.StreamableFile(file.buffer);
    }
    async getSuitableTemplates(productId) {
        return this.labelService.getSuitableTemplatesForProduct(productId);
    }
    async getBranchSettings(branchId) {
        return this.labelService.getBranchSettings(branchId);
    }
    async updateBranchSettings(branchId, settings) {
        return this.labelService.updateBranchSettings(branchId, settings);
    }
    async verifyLabel(serialNumber) {
        return this.labelService.verifyLabelAuthenticity(serialNumber);
    }
    async getComplianceAudit(branchId, fromDate, toDate) {
        return this.labelService.generateComplianceAudit({ branchId, fromDate, toDate });
    }
    async getAnalyticsOverview() {
        return this.labelService.getAnalyticsOverview();
    }
    async getBranchAnalytics(branchId) {
        return this.labelService.getBranchAnalytics(branchId);
    }
    async generateQRCode(qrDto) {
        return this.labelService.generateEnhancedQRCode(qrDto);
    }
    async previewQRCode(content, type = 'text', size = 300, foregroundColor = '#000000', backgroundColor = '#ffffff') {
        return this.labelService.previewQRCode({
            content,
            type: type,
            size,
            foregroundColor,
            backgroundColor
        });
    }
    async getQRTemplates() {
        return this.labelService.getQRCodeTemplates();
    }
    async generateProductQRCode(productId, options) {
        return this.labelService.generateProductQRCode(productId, options);
    }
    async proxyQRCode(query, res) {
        const { data, size = 300, color = '000000', bgcolor = 'ffffff', ecc = 'M', margin = 10 } = query;
        if (!data) {
            return res.status(400).json({ error: 'Missing data parameter' });
        }
        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&format=png&ecc=${ecc}&color=${color}&bgcolor=${bgcolor}&margin=${margin}`;
            console.log('🔗 Proxying QR request:', qrUrl);
            const response = await fetch(qrUrl);
            if (!response.ok) {
                throw new Error(`QR generation failed: ${response.status}`);
            }
            const imageBuffer = await response.arrayBuffer();
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.setHeader('Access-Control-Allow-Origin', '*');
            console.log('✅ QR proxy successful, returning image');
            return res.send(Buffer.from(imageBuffer));
        }
        catch (error) {
            console.error('❌ QR proxy error:', error);
            return res.status(500).json({ error: 'Failed to generate QR code' });
        }
    }
    async healthCheck() {
        return {
            status: 'healthy',
            service: 'LeafyHealth Professional Label Design & Printing System',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            database: 'connected',
            integrations: {
                product_orchestrator: 'active',
                image_management: 'active',
                inventory_management: 'active',
                direct_data_gateway: 'active',
                qr_code_generator: 'active'
            }
        };
    }
};
exports.LabelController = LabelController;
__decorate([
    (0, common_1.Get)('media-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available label media types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of label media types with dimensions and specifications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getMediaTypes", null);
__decorate([
    (0, common_1.Get)('media-types/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get media type details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Media type specifications and layout information' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getMediaTypeById", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available label templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of professional label templates' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: create_label_dto_1.LabelType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'mediaId', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'branchId', type: Number, required: false }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('mediaId')),
    __param(2, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template details with field mappings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Complete template configuration and field layout' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getTemplateById", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Create custom label template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate real-time label preview with product data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Label preview with actual product information' }),
    (0, swagger_1.ApiQuery)({ name: 'templateId', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'productId', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'branchId', type: Number, required: false }),
    __param(0, (0, common_1.Query)('templateId')),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "generateLabelPreview", null);
__decorate([
    (0, common_1.Post)('preview/batch'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate batch preview for multiple products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Batch label previews' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "generateBatchPreview", null);
__decorate([
    (0, common_1.Post)('print'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate and print labels with full traceability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Print job created with tracking information' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [print_label_dto_1.PrintLabelDto]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "printLabels", null);
__decorate([
    (0, common_1.Get)('print/jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get print job history with full audit trail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Complete print job history' }),
    (0, swagger_1.ApiQuery)({ name: 'branchId', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    __param(0, (0, common_1.Query)('branchId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getPrintJobs", null);
__decorate([
    (0, common_1.Get)('print/jobs/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed print job information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Complete print job details with all printed labels' }),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getPrintJobDetails", null);
__decorate([
    (0, common_1.Get)('print/jobs/:jobId/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download print job file (PDF/ZPL)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Print job file download' }),
    __param(0, (0, common_1.Param)('jobId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "downloadPrintJob", null);
__decorate([
    (0, common_1.Get)('products/:productId/suitable-templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get templates suitable for specific product type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of compatible templates for the product' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getSuitableTemplates", null);
__decorate([
    (0, common_1.Get)('settings/:branchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get label print settings for branch' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Branch-specific label printing configuration' }),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getBranchSettings", null);
__decorate([
    (0, common_1.Post)('settings/:branchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update branch label print settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings updated successfully' }),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "updateBranchSettings", null);
__decorate([
    (0, common_1.Get)('verify/:serialNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify label authenticity by serial number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Label verification result with product details' }),
    __param(0, (0, common_1.Param)('serialNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "verifyLabel", null);
__decorate([
    (0, common_1.Get)('compliance/audit'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate compliance audit report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comprehensive compliance audit with FSSAI tracking' }),
    (0, swagger_1.ApiQuery)({ name: 'branchId', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', type: String, required: false }),
    __param(0, (0, common_1.Query)('branchId')),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getComplianceAudit", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive label system analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Complete system performance metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getAnalyticsOverview", null);
__decorate([
    (0, common_1.Get)('analytics/usage/:branchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get branch-specific label usage analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Branch label usage patterns and efficiency metrics' }),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getBranchAnalytics", null);
__decorate([
    (0, common_1.Post)('qr/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate enhanced QR code for product labels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code generated with styling options' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "generateQRCode", null);
__decorate([
    (0, common_1.Get)('qr/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview QR code with real-time styling' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code preview URL' }),
    (0, swagger_1.ApiQuery)({ name: 'content', type: String, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'whatsapp'], required: false }),
    (0, swagger_1.ApiQuery)({ name: 'size', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'foregroundColor', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'backgroundColor', type: String, required: false }),
    __param(0, (0, common_1.Query)('content')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('size')),
    __param(3, (0, common_1.Query)('foregroundColor')),
    __param(4, (0, common_1.Query)('backgroundColor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String, String]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "previewQRCode", null);
__decorate([
    (0, common_1.Get)('qr/templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QR code templates for different use cases' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pre-configured QR code templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "getQRTemplates", null);
__decorate([
    (0, common_1.Post)('qr/product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate QR code for specific product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product-specific QR code with embedded data' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "generateProductQRCode", null);
__decorate([
    (0, common_1.Get)('qr/proxy'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy QR code generation to bypass CORS issues' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code image (PNG)', schema: { type: 'string', format: 'binary' } }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "proxyQRCode", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Label design service health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service health status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabelController.prototype, "healthCheck", null);
exports.LabelController = LabelController = __decorate([
    (0, swagger_1.ApiTags)('Professional Label Design & Printing System'),
    (0, common_1.Controller)('labels'),
    __metadata("design:paramtypes", [label_service_1.LabelService])
], LabelController);
//# sourceMappingURL=label.controller.js.map