import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DesignTemplateService } from '../services/design-template.service';
import { CreateDesignTemplateDto, UpdateDesignTemplateDto } from '../dto/design-template.dto';

@ApiTags('Design Templates - Content Layout')
@Controller('templates')
export class DesignTemplateController {
  constructor(private readonly designTemplateService: DesignTemplateService) {}

  @Get()
  @ApiOperation({ summary: 'Get all design templates (content layout)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of design templates with content layout' })
  async findAll(@Query('active') active?: boolean) {
    const templates = await this.designTemplateService.findAll(active);
    return {
      success: true,
      data: templates,
      message: 'Design templates retrieved successfully'
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get design template by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Design template with content layout' })
  async findOne(@Param('id') id: string) {
    const template = await this.designTemplateService.findOne(+id);
    return {
      success: true,
      data: template,
      message: 'Design template retrieved successfully'
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new design template (content layout)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Design template created with content layout' })
  async create(@Body() createDto: CreateDesignTemplateDto) {
    const template = await this.designTemplateService.create(createDto);
    return {
      success: true,
      data: template,
      message: 'Design template created successfully'
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update design template (content layout)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Design template updated with new content layout' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateDesignTemplateDto) {
    const template = await this.designTemplateService.update(+id, updateDto);
    return {
      success: true,
      data: template,
      message: 'Design template updated successfully'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete design template' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Design template deleted' })
  async remove(@Param('id') id: string) {
    await this.designTemplateService.delete(+id);
    return {
      success: true,
      message: 'Design template deleted successfully'
    };
  }
}