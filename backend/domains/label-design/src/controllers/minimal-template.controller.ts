import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MinimalTemplateService } from '../services/minimal-template.service';

@Controller('templates')
@ApiTags('Template Management')
export class MinimalTemplateController {
  constructor(private readonly minimalTemplateService: MinimalTemplateService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAll() {
    return await this.minimalTemplateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.minimalTemplateService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async create(@Body() templateData: any) {
    return await this.minimalTemplateService.create(templateData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: any) {
    return await this.minimalTemplateService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate template' })
  @ApiResponse({ status: 200, description: 'Template deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.minimalTemplateService.remove(id);
  }
}