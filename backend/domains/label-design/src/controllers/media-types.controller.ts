import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MediaTypesService } from '../services/media-types.service';
import { CreateMediaTypeDto, UpdateMediaTypeDto } from '../dto/media-types.dto';

@ApiTags('Media Types - Physical Properties')
@Controller('media-types')
export class MediaTypesController {
  constructor(private readonly mediaTypesService: MediaTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all media types (physical properties)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of media types with physical dimensions' })
  async findAll(@Query('active') active?: boolean) {
    const mediaTypes = await this.mediaTypesService.findAll(active);
    return {
      success: true,
      data: mediaTypes,
      message: 'Media types retrieved successfully'
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media type by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media type with physical dimensions' })
  async findOne(@Param('id') id: string) {
    const mediaType = await this.mediaTypesService.findOne(+id);
    return {
      success: true,
      data: mediaType,
      message: 'Media type retrieved successfully'
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new media type (physical properties)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Media type created with physical dimensions' })
  async create(@Body() createDto: CreateMediaTypeDto) {
    const mediaType = await this.mediaTypesService.create(createDto);
    return {
      success: true,
      data: mediaType,
      message: 'Media type created successfully'
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update media type (physical properties)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media type updated with new physical dimensions' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateMediaTypeDto) {
    const mediaType = await this.mediaTypesService.update(+id, updateDto);
    return {
      success: true,
      data: mediaType,
      message: 'Media type updated successfully'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media type (soft delete)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media type deactivated' })
  async remove(@Param('id') id: string) {
    const result = await this.mediaTypesService.update(+id, { isActive: false });
    return {
      success: true,
      message: 'Media type deleted successfully',
      data: result
    };
  }
}