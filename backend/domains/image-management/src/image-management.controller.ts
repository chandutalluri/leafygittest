import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Query, 
  Body, 
  UploadedFile, 
  UploadedFiles,
  UseInterceptors, 
  ParseIntPipe,
  Res,
  Logger,
  UseGuards,
  UsePipes,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
// import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
// import { ImageUploadSchema } from '../../../shared/validation/schemas';
// import { createLogger } from '../../../shared/logger/winston.config';
import { FixedImageService } from './fixed-image.service';

@ApiTags('Image Management')
@Controller('api/image-management')
export class AdminImageController {
  private readonly logger = new Logger(AdminImageController.name);

  constructor(private readonly imageService: FixedImageService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      service: 'image-management',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      port: process.env.PORT || 3035,
      features: [
        'Image upload and processing',
        'Image variant generation',
        'Image serving and delivery',
        'Statistics and analytics',
        'CRUD operations',
        'Entity-based image management',
        'Bulk operations',
        'Advanced filtering'
      ]
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload images with metadata' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 10 * 1024 * 1024 }
  }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: {
      entityType?: string;
      entityId?: number;
      category?: string;
      description?: string;
      altText?: string;
      tags?: string;
      isPublic?: boolean;
    }
  ) {
    try {
      this.logger.log('Upload request received: ' + JSON.stringify({ 
        file: file ? { name: file.originalname, size: file.size, type: file.mimetype } : 'missing', 
        uploadDto,
        bodyKeys: Object.keys(uploadDto || {})
      }));
      
      if (!file || !file.buffer || file.size === 0) {
        this.logger.error('No valid file received in upload request');
        throw new BadRequestException({
          success: false,
          message: 'No image file provided or file is empty',
          error: 'Bad Request',
          statusCode: 400
        });
      }

      // Validate file type
      if (!file.mimetype.startsWith('image/')) {
        this.logger.error('Invalid file type: ' + file.mimetype);
        throw new BadRequestException({
          success: false,
          message: 'Only image files are allowed',
          error: 'Invalid file type',
          statusCode: 400
        });
      }

      const result = await this.imageService.uploadImage(file, uploadDto);

      return {
        success: true,
        message: 'Image uploaded successfully',
        data: result
      };
    } catch (error) {
      this.logger.error('Error uploading images:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Upload failed',
        error: error.message,
        statusCode: 400
      });
    }
  }

  @Get('images')
  @ApiOperation({ summary: 'Get images with advanced filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Images retrieved successfully' })
  async getImages(@Query() query: {
    page?: number;
    limit?: number;
    category?: string;
    entityType?: string;
    entityId?: number;
    isPublic?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return await this.imageService.getImages(query);
  }

  @Get('images/:id/preview')
  @ApiOperation({ summary: 'Get image preview with metadata for frontend display' })
  @ApiResponse({ status: 200, description: 'Image preview data with serve URL' })
  async getImagePreview(@Param('id', ParseIntPipe) id: number) {
    try {
      const preview = await this.imageService.getImageById(id);
      return preview;
    } catch (error) {
      this.logger.error(`Error getting preview for image ${id}:`, error);
      throw error;
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get comprehensive image statistics' })
  @ApiResponse({ status: 200, description: 'Image statistics retrieved' })
  async getImageStats() {
    try {
      const stats = await this.imageService.getImageStats();
      return stats;
    } catch (error) {
      this.logger.error('Error getting image stats:', error);
      throw error;
    }
  }

  @Get('serve/:filename')
  @ApiOperation({ summary: 'Serve image files with proper headers' })
  @ApiResponse({ status: 200, description: 'Image file served' })
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      this.logger.log(`Serving image: ${filename}`);
      
      const fs = require('fs');
      const path = require('path');
      
      // Try multiple possible paths
      const possiblePaths = [
        path.join(process.cwd(), 'backend/domains/image-management/uploads', filename),
        path.join(process.cwd(), 'backend/domains/image-management/uploads/images', filename),
        path.join(process.cwd(), 'uploads', filename),
        path.join(__dirname, '../../uploads', filename),
        path.join(__dirname, '../uploads', filename)
      ];

      let imagePath = null;
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          imagePath = testPath;
          this.logger.log(`Found image at: ${imagePath}`);
          break;
        }
      }

      if (!imagePath) {
        this.logger.error(`Image file not found: ${filename}`);
        return res.status(404).send('Image not found');
      }

      // Get file info and serve
      const stats = fs.statSync(imagePath);
      const mimeType = filename.endsWith('.png') ? 'image/png' : 
                     filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'image/jpeg' :
                     'image/jpeg';
      
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      const imageStream = fs.createReadStream(imagePath);
      imageStream.pipe(res);
      
    } catch (error) {
      this.logger.error(`Error serving image ${filename}:`, error);
      res.status(500).send('Failed to serve image');
    }
  }

  @Get('images/:id')
  @ApiOperation({ summary: 'Get single image by ID with full metadata and preview data' })
  @ApiResponse({ status: 200, description: 'Image retrieved successfully' })
  async getImageById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.imageService.getImageById(id);
    } catch (error) {
      this.logger.error(`Error getting image ${id}:`, error);
      throw error;
    }
  }

  @Put('images/:id')
  @ApiOperation({ summary: 'Update image metadata' })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  async updateImage(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    try {
      return await this.imageService.updateImage(id.toString(), updateDto);
    } catch (error) {
      this.logger.error(`Error updating image ${id}:`, error);
      throw error;
    }
  }

  @Delete('images/:id')
  @ApiOperation({ summary: 'Delete image and its variants' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.imageService.deleteImage(id);
    } catch (error) {
      this.logger.error(`Error deleting image ${id}:`, error);
      throw error;
    }
  }

  @Post('images/:id/variants')
  @ApiOperation({ summary: 'Generate image variants' })
  @ApiResponse({ status: 201, description: 'Image variants generated' })
  async generateImageVariants(@Param('id', ParseIntPipe) id: number) {
    try {
      return { message: 'Image variants feature not implemented yet' };
    } catch (error) {
      this.logger.error(`Error generating variants for image ${id}:`, error);
      throw error;
    }
  }

  @Get('images/:id/usage')
  @ApiOperation({ summary: 'Get image usage information' })
  @ApiResponse({ status: 200, description: 'Image usage retrieved' })
  async getImageUsage(@Param('id', ParseIntPipe) id: number) {
    try {
      return { message: 'Image usage tracking feature not implemented yet' };
    } catch (error) {
      this.logger.error(`Error getting usage for image ${id}:`, error);
      throw error;
    }
  }
}