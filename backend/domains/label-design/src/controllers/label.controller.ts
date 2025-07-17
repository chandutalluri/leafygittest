import { Controller, Get, Post, Body, Param, Query, UseGuards, Res, StreamableFile, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { LabelService } from '../services/label.service';
import { CreateLabelDto, LabelType } from '../dto/create-label.dto';
import { PrintLabelDto } from '../dto/print-label.dto';

@ApiTags('Professional Label Design & Printing System')
@Controller('labels')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  // Media Types Management
  @Get('media-types')
  @ApiOperation({ summary: 'Get all available label media types' })
  @ApiResponse({ status: 200, description: 'List of label media types with dimensions and specifications' })
  async getMediaTypes() {
    return this.labelService.getMediaTypes();
  }

  @Get('media-types/:id')
  @ApiOperation({ summary: 'Get media type details by ID' })
  @ApiResponse({ status: 200, description: 'Media type specifications and layout information' })
  async getMediaTypeById(@Param('id') id: number) {
    return this.labelService.getMediaTypeById(id);
  }

  // Label Templates Management
  @Get('templates')
  @ApiOperation({ summary: 'Get available label templates' })
  @ApiResponse({ status: 200, description: 'List of professional label templates' })
  @ApiQuery({ name: 'type', enum: LabelType, required: false })
  @ApiQuery({ name: 'mediaId', type: Number, required: false })
  @ApiQuery({ name: 'branchId', type: Number, required: false })
  async getTemplates(
    @Query('type') type?: LabelType,
    @Query('mediaId') mediaId?: number,
    @Query('branchId') branchId?: number,
  ) {
    return this.labelService.getTemplates({ type, mediaId, branchId });
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get template details with field mappings' })
  @ApiResponse({ status: 200, description: 'Complete template configuration and field layout' })
  async getTemplateById(@Param('id') id: number) {
    return this.labelService.getTemplateById(id);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create custom label template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createTemplate(@Body() templateDto: any) {
    return this.labelService.createTemplate(templateDto);
  }

  // Label Generation and Preview
  @Get('preview')
  @ApiOperation({ summary: 'Generate real-time label preview with product data' })
  @ApiResponse({ status: 200, description: 'Label preview with actual product information' })
  @ApiQuery({ name: 'templateId', type: Number, required: true })
  @ApiQuery({ name: 'productId', type: Number, required: true })
  @ApiQuery({ name: 'branchId', type: Number, required: false })
  async generateLabelPreview(
    @Query('templateId') templateId: string,
    @Query('productId') productId: string,
    @Query('branchId') branchId?: string,
  ) {
    if (!templateId || !productId) {
      throw new HttpException('templateId and productId are required', HttpStatus.BAD_REQUEST);
    }
    
    const numericTemplateId = parseInt(templateId, 10);
    const numericProductId = parseInt(productId, 10);
    const numericBranchId = branchId ? parseInt(branchId, 10) : undefined;
    
    if (isNaN(numericTemplateId) || isNaN(numericProductId)) {
      throw new HttpException('templateId and productId must be valid numbers', HttpStatus.BAD_REQUEST);
    }
    
    return this.labelService.generateLabelPreview(numericTemplateId, numericProductId, numericBranchId);
  }

  @Post('preview/batch')
  @ApiOperation({ summary: 'Generate batch preview for multiple products' })
  @ApiResponse({ status: 200, description: 'Batch label previews' })
  async generateBatchPreview(@Body() batchDto: { templateId: number; productIds: number[]; branchId?: number }) {
    return this.labelService.generateBatchPreview(batchDto.templateId, batchDto.productIds, batchDto.branchId);
  }

  // Label Printing System
  @Post('print')
  @ApiOperation({ summary: 'Generate and print labels with full traceability' })
  @ApiResponse({ status: 200, description: 'Print job created with tracking information' })
  async printLabels(@Body() printDto: PrintLabelDto) {
    return this.labelService.printLabels(printDto);
  }

  @Get('print/jobs')
  @ApiOperation({ summary: 'Get print job history with full audit trail' })
  @ApiResponse({ status: 200, description: 'Complete print job history' })
  @ApiQuery({ name: 'branchId', type: Number, required: false })
  @ApiQuery({ name: 'status', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getPrintJobs(
    @Query('branchId') branchId?: number,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    return this.labelService.getPrintJobs({ branchId, status, limit });
  }

  @Get('print/jobs/:jobId')
  @ApiOperation({ summary: 'Get detailed print job information' })
  @ApiResponse({ status: 200, description: 'Complete print job details with all printed labels' })
  async getPrintJobDetails(@Param('jobId') jobId: number) {
    return this.labelService.getPrintJobDetails(jobId);
  }

  @Get('print/jobs/:jobId/download')
  @ApiOperation({ summary: 'Download print job file (PDF/ZPL)' })
  @ApiResponse({ status: 200, description: 'Print job file download' })
  async downloadPrintJob(@Param('jobId') jobId: number, @Res() res: Response) {
    const file = await this.labelService.downloadPrintJobFile(jobId);
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });
    return new StreamableFile(file.buffer);
  }

  // Product Integration
  @Get('products/:productId/suitable-templates')
  @ApiOperation({ summary: 'Get templates suitable for specific product type' })
  @ApiResponse({ status: 200, description: 'List of compatible templates for the product' })
  async getSuitableTemplates(@Param('productId') productId: number) {
    return this.labelService.getSuitableTemplatesForProduct(productId);
  }

  // Branch Settings
  @Get('settings/:branchId')
  @ApiOperation({ summary: 'Get label print settings for branch' })
  @ApiResponse({ status: 200, description: 'Branch-specific label printing configuration' })
  async getBranchSettings(@Param('branchId') branchId: number) {
    return this.labelService.getBranchSettings(branchId);
  }

  @Post('settings/:branchId')
  @ApiOperation({ summary: 'Update branch label print settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async updateBranchSettings(@Param('branchId') branchId: number, @Body() settings: any) {
    return this.labelService.updateBranchSettings(branchId, settings);
  }

  // Verification and Compliance
  @Get('verify/:serialNumber')
  @ApiOperation({ summary: 'Verify label authenticity by serial number' })
  @ApiResponse({ status: 200, description: 'Label verification result with product details' })
  async verifyLabel(@Param('serialNumber') serialNumber: string) {
    return this.labelService.verifyLabelAuthenticity(serialNumber);
  }

  @Get('compliance/audit')
  @ApiOperation({ summary: 'Generate compliance audit report' })
  @ApiResponse({ status: 200, description: 'Comprehensive compliance audit with FSSAI tracking' })
  @ApiQuery({ name: 'branchId', type: Number, required: false })
  @ApiQuery({ name: 'fromDate', type: String, required: false })
  @ApiQuery({ name: 'toDate', type: String, required: false })
  async getComplianceAudit(
    @Query('branchId') branchId?: number,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.labelService.generateComplianceAudit({ branchId, fromDate, toDate });
  }

  // Analytics and Reporting
  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get comprehensive label system analytics' })
  @ApiResponse({ status: 200, description: 'Complete system performance metrics' })
  async getAnalyticsOverview() {
    return this.labelService.getAnalyticsOverview();
  }

  @Get('analytics/usage/:branchId')
  @ApiOperation({ summary: 'Get branch-specific label usage analytics' })
  @ApiResponse({ status: 200, description: 'Branch label usage patterns and efficiency metrics' })
  async getBranchAnalytics(@Param('branchId') branchId: number) {
    return this.labelService.getBranchAnalytics(branchId);
  }

  // QR Code Generation System
  @Post('qr/generate')
  @ApiOperation({ summary: 'Generate enhanced QR code for product labels' })
  @ApiResponse({ status: 200, description: 'QR code generated with styling options' })
  async generateQRCode(@Body() qrDto: {
    content: string;
    type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'whatsapp';
    size?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    foregroundColor?: string;
    backgroundColor?: string;
    margin?: number;
    format?: 'png' | 'svg' | 'pdf';
  }) {
    return this.labelService.generateEnhancedQRCode(qrDto);
  }

  @Get('qr/preview')
  @ApiOperation({ summary: 'Preview QR code with real-time styling' })
  @ApiResponse({ status: 200, description: 'QR code preview URL' })
  @ApiQuery({ name: 'content', type: String, required: true })
  @ApiQuery({ name: 'type', enum: ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'whatsapp'], required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'foregroundColor', type: String, required: false })
  @ApiQuery({ name: 'backgroundColor', type: String, required: false })
  async previewQRCode(
    @Query('content') content: string,
    @Query('type') type: string = 'text',
    @Query('size') size: number = 300,
    @Query('foregroundColor') foregroundColor: string = '#000000',
    @Query('backgroundColor') backgroundColor: string = '#ffffff',
  ) {
    return this.labelService.previewQRCode({
      content,
      type: type as any,
      size,
      foregroundColor,
      backgroundColor
    });
  }

  @Get('qr/templates')
  @ApiOperation({ summary: 'Get QR code templates for different use cases' })
  @ApiResponse({ status: 200, description: 'Pre-configured QR code templates' })
  async getQRTemplates() {
    return this.labelService.getQRCodeTemplates();
  }

  @Post('qr/product/:productId')
  @ApiOperation({ summary: 'Generate QR code for specific product' })
  @ApiResponse({ status: 200, description: 'Product-specific QR code with embedded data' })
  async generateProductQRCode(
    @Param('productId') productId: number,
    @Body() options: {
      includePrice?: boolean;
      includeBranch?: boolean;
      customUrl?: string;
      branchId?: number;
    }
  ) {
    return this.labelService.generateProductQRCode(productId, options);
  }

  @Get('qr/proxy')
  @ApiOperation({ summary: 'Proxy QR code generation to bypass CORS issues' })
  @ApiResponse({ status: 200, description: 'QR code image (PNG)', schema: { type: 'string', format: 'binary' } })
  async proxyQRCode(@Query() query: any, @Res() res: Response) {
    const { data, size = 300, color = '000000', bgcolor = 'ffffff', ecc = 'M', margin = 10 } = query;
    
    if (!data) {
      return res.status(400).json({ error: 'Missing data parameter' });
    }

    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&format=png&ecc=${ecc}&color=${color}&bgcolor=${bgcolor}&margin=${margin}`;
      
      console.log('🔗 Proxying QR request:', qrUrl);
      
      // Fetch QR code from external API
      const response = await fetch(qrUrl);
      
      if (!response.ok) {
        throw new Error(`QR generation failed: ${response.status}`);
      }

      const imageBuffer = await response.arrayBuffer();
      
      // Set proper headers for image response
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      console.log('✅ QR proxy successful, returning image');
      return res.send(Buffer.from(imageBuffer));
    } catch (error) {
      console.error('❌ QR proxy error:', error);
      return res.status(500).json({ error: 'Failed to generate QR code' });
    }
  }

  // Health Check
  @Get('health')
  @ApiOperation({ summary: 'Label design service health check' })
  @ApiResponse({ status: 200, description: 'Service health status' })
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
}