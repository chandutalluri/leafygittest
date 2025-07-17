import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageService } from './services/image.service';
import { ImageOptimizationService } from './services/image-optimization.service';
import { FileStructureService } from './services/file-structure.service';
import * as path from 'path';
import { promises as fs } from 'fs';

@Controller('api/image-management')
export class EnhancedImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly imageOptimizationService: ImageOptimizationService,
    private readonly fileStructureService: FileStructureService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'healthy',
      service: 'Image Management Service',
      version: '2.0.0',
      features: [
        'Industry-standard file structure',
        'Multi-device image optimization',
        'PWA image variants',
        'Responsive image processing',
        'Quality enhancement pipeline'
      ],
      timestamp: new Date().toISOString(),
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Validate image
      const isValid = await this.imageOptimizationService.validateImage(file.buffer);
      if (!isValid) {
        throw new BadRequestException('Invalid image file');
      }

      // Determine entity type and generate variants
      const entityType = body.entityType || 'products';
      const uploadsDir = this.fileStructureService.getUploadPath(entityType);
      
      // Process image with optimization and variants
      const processResult = await this.imageOptimizationService.processImage(
        file.buffer,
        uploadsDir,
        file.originalname,
        entityType,
        true
      );

      // Save to database
      const imageRecord = await this.imageService.create({
        filename: processResult.original,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        entityType,
        entityId: body.entityId,
        tags: body.tags ? JSON.parse(body.tags) : [],
        description: body.description || '',
        variants: processResult.variants,
        metadata: processResult.metadata,
      });

      return {
        success: true,
        data: imageRecord,
        variants: Object.keys(processResult.variants),
        message: 'Image uploaded and optimized successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Get('images')
  async getImages(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    try {
      const images = await this.imageService.findAll({
        entityType,
        entityId,
        limit: limit ? parseInt(limit) : 50,
        sortBy: sortBy || 'uploadedAt',
        sortOrder: sortOrder || 'desc',
      });

      return {
        success: true,
        data: images,
        total: images.length,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        total: 0,
        error: error.message,
      };
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const stats = await this.imageService.getStats();
      const storageStats = await this.getStorageStats();
      
      return {
        success: true,
        stats: {
          ...stats,
          ...storageStats,
        },
      };
    } catch (error) {
      return {
        success: false,
        stats: {
          totalImages: 0,
          totalSize: '0 B',
          storageUsed: '0 B',
        },
        error: error.message,
      };
    }
  }

  @Get('serve/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const imagePath = path.join(__dirname, '..', 'uploads', filename);
      
      console.log(`Serving image: ${filename}`);
      console.log(`Looking for file at: ${imagePath}`);

      try {
        await fs.access(imagePath);
        console.log(`Found image at: ${imagePath}`);
      } catch {
        // Try alternative paths
        const altPaths = [
          path.join(__dirname, '..', 'uploads', 'products', 'original', filename),
          path.join(__dirname, '..', 'uploads', 'images', filename),
          path.join(__dirname, '..', '..', 'uploads', filename),
        ];

        let foundPath = null;
        for (const altPath of altPaths) {
          try {
            await fs.access(altPath);
            foundPath = altPath;
            break;
          } catch {}
        }

        if (!foundPath) {
          throw new NotFoundException(`Image not found: ${filename}`);
        }
        
        const imageBuffer = await fs.readFile(foundPath);
        const mimeType = this.imageOptimizationService.getMimeType(path.extname(filename));
        
        res.set({
          'Content-Type': mimeType,
          'Content-Length': imageBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*',
        });

        return res.send(imageBuffer);
      }

      const imageBuffer = await fs.readFile(imagePath);
      const mimeType = this.imageOptimizationService.getMimeType(path.extname(filename));
      
      res.set({
        'Content-Type': mimeType,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      });

      return res.send(imageBuffer);
    } catch (error) {
      console.error(`Error serving image ${filename}:`, error.message);
      throw new NotFoundException(`Image not found: ${filename}`);
    }
  }

  @Get('images/:id')
  async getImage(@Param('id') id: string) {
    try {
      const image = await this.imageService.findById(id);
      return {
        success: true,
        data: image,
      };
    } catch (error) {
      throw new NotFoundException(`Image not found: ${id}`);
    }
  }

  @Delete('images/:id')
  async deleteImage(@Param('id') id: string) {
    try {
      await this.imageService.delete(id);
      return {
        success: true,
        message: 'Image deleted successfully',
      };
    } catch (error) {
      throw new NotFoundException(`Image not found: ${id}`);
    }
  }

  @Post('images/:id/variants')
  async generateVariants(
    @Param('id') id: string,
    @Body() body: { variants: string[] },
  ) {
    try {
      const image = await this.imageService.findById(id);
      const imagePath = path.join(__dirname, '..', 'uploads', image.filename);
      const imageBuffer = await fs.readFile(imagePath);
      
      const uploadsDir = this.fileStructureService.getUploadPath(image.entityType || 'products');
      
      // Generate responsive variants for different screen sizes
      const variants = await this.imageOptimizationService.createResponsiveVariants(
        imageBuffer,
        uploadsDir,
        image.filename,
        image.entityType || 'products'
      );

      // Update database with new variants
      await this.imageService.update(id, { variants });

      return {
        success: true,
        data: variants,
        message: 'Variants generated successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to generate variants: ${error.message}`);
    }
  }

  @Post('bulk-delete')
  async bulkDelete(@Body() body: { imageIds: string[] }) {
    try {
      const results = await Promise.allSettled(
        body.imageIds.map(id => this.imageService.delete(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: true,
        deleted: successful,
        failed,
        message: `Deleted ${successful} images, ${failed} failed`,
      };
    } catch (error) {
      throw new BadRequestException(`Bulk delete failed: ${error.message}`);
    }
  }

  @Post('optimize')
  async optimizeImages(@Body() body: { imageIds: string[] }) {
    try {
      const results = [];
      
      for (const imageId of body.imageIds) {
        try {
          const image = await this.imageService.findById(imageId);
          const imagePath = path.join(__dirname, '..', 'uploads', image.filename);
          const optimizedPath = path.join(__dirname, '..', 'uploads', 'processed', `optimized_${image.filename}`);
          
          await this.imageOptimizationService.optimizeExistingImage(
            imagePath,
            optimizedPath,
            { quality: 85, format: 'jpeg', progressive: true }
          );

          results.push({ id: imageId, status: 'optimized' });
        } catch (error) {
          results.push({ id: imageId, status: 'failed', error: error.message });
        }
      }

      return {
        success: true,
        data: results,
        message: 'Optimization completed',
      };
    } catch (error) {
      throw new BadRequestException(`Optimization failed: ${error.message}`);
    }
  }

  private async getStorageStats() {
    try {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      const totalSize = await this.fileStructureService.getDirectorySize(uploadsDir);
      
      return {
        storageUsed: this.fileStructureService.formatFileSize(totalSize),
        uploadsDirectory: uploadsDir,
      };
    } catch (error) {
      return {
        storageUsed: '0 B',
        error: error.message,
      };
    }
  }
}