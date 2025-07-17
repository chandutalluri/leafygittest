import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MinimalTemplateService } from '../services/minimal-template.service';

@Controller('custom-templates')
@ApiTags('Custom Template Management')
export class CustomTemplateController {
  constructor(private readonly minimalTemplateService: MinimalTemplateService) {}

  @Get()
  @ApiOperation({ summary: 'Get all custom templates' })
  @ApiResponse({ status: 200, description: 'Custom templates retrieved successfully' })
  async findAll() {
    return await this.minimalTemplateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom template by ID' })
  @ApiResponse({ status: 200, description: 'Custom template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Custom template not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.minimalTemplateService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new custom template' })
  @ApiResponse({ status: 201, description: 'Custom template created successfully' })
  async create(@Body() templateData: any) {
    // Sanitize the data for custom template creation
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

  @Put(':id')
  @ApiOperation({ summary: 'Update custom template' })
  @ApiResponse({ status: 200, description: 'Custom template updated successfully' })
  @ApiResponse({ status: 404, description: 'Custom template not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: any) {
    return await this.minimalTemplateService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete custom template' })
  @ApiResponse({ status: 200, description: 'Custom template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Custom template not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.minimalTemplateService.remove(id);
  }
}