import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MediaTemplateService } from '../services/media-template.service';
import { CreateMediaTemplateDto, UpdateMediaTemplateDto } from '../dto/media-template.dto';

@ApiTags('Media Templates')
@Controller('media-templates')
export class MediaTemplateController {
  constructor(private readonly mediaTemplateService: MediaTemplateService) {}

  @Get()
  @ApiOperation({ summary: 'Get all media templates' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of media templates' })
  async findAll(@Query('active') active?: boolean) {
    const templates = await this.mediaTemplateService.findAll(active);
    return {
      success: true,
      data: templates
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media template by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media template details' })
  async findOne(@Param('id') id: string) {
    const template = await this.mediaTemplateService.findOne(+id);
    return {
      success: true,
      data: template
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new media template' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Media template created' })
  async create(@Body() createDto: CreateMediaTemplateDto) {
    const template = await this.mediaTemplateService.create(createDto);
    return {
      success: true,
      data: template,
      message: 'Media template created successfully'
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update media template' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media template updated' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateMediaTemplateDto) {
    const template = await this.mediaTemplateService.update(+id, updateDto);
    return {
      success: true,
      data: template,
      message: 'Media template updated successfully'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media template' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media template deleted' })
  async remove(@Param('id') id: string) {
    await this.mediaTemplateService.delete(+id);
    return {
      success: true,
      message: 'Media template deleted successfully'
    };
  }
}