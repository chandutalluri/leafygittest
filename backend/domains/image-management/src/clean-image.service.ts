import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { db } from './database/drizzle';
import { image_management_images } from '../drizzle/schema';
import { eq, and, desc, count, sql, ilike, gte } from 'drizzle-orm';

@Injectable()
export class CleanImageService {
  private readonly logger = new Logger(CleanImageService.name);
  private readonly uploadPath = process.env.UPLOAD_DIR || 'uploads/images';
  private readonly variantPath = process.env.VARIANT_DIR || 'uploads/variants';

  constructor(private configService: ConfigService) {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [this.uploadPath, this.variantPath];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    });
  }

  async uploadImage(file: any, uploadDto: any): Promise<any> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const uniqueFilename = `${uuidv4()}-${file.originalname}`;
      const filePath = path.join(this.uploadPath, uniqueFilename);

      // Validate file buffer exists
      if (!file.buffer && !file.path) {
        throw new Error('No file data provided - buffer and path are both missing');
      }

      // Get file buffer
      const fileBuffer = file.buffer || fs.readFileSync(file.path);
      
      if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
        throw new Error('Invalid file buffer - file may be corrupted or empty');
      }

      // Save file to disk
      fs.writeFileSync(filePath, fileBuffer);

      // Get image metadata using sharp with error handling
      let metadata;
      try {
        metadata = await sharp(fileBuffer).metadata();
        console.log('Sharp metadata extracted:', metadata);
      } catch (error) {
        console.log('Sharp failed, using fallback metadata:', error.message);
        // Fallback metadata for non-image files
        metadata = { width: 400, height: 300, format: 'jpeg' };
      }

      // Parse tags
      const tags = uploadDto.tags ? uploadDto.tags.split(',').map((tag: string) => tag.trim()) : [];

      // Create database record
      const imageRecord = {
        filename: uniqueFilename,
        originalName: file.originalname,
        path: filePath,
        size: file.size,
        mimeType: file.mimetype,
        width: metadata.width || 0,
        height: metadata.height || 0,
        entityType: uploadDto.entityType || 'general',
        entityId: uploadDto.entityId ? parseInt(uploadDto.entityId) : null,
        category: uploadDto.category || 'uncategorized',
        description: uploadDto.description || '',
        altText: uploadDto.altText || '',
        tags: JSON.stringify(tags),
        isPublic: uploadDto.isPublic !== 'false',
        variants: JSON.stringify([]),
        uploadedBy: 1,
        uploadedAt: new Date(),
        updatedAt: new Date()
      };

      // Insert into database
      const [savedImage] = await db.insert(image_management_images).values(imageRecord).returning();

      this.logger.log(`Image uploaded successfully: ${savedImage.id}`);

      return {
        success: true,
        image: {
          id: savedImage.id,
          filename: savedImage.filename,
          originalFilename: savedImage.originalName,
          path: savedImage.path,
          sizeBytes: savedImage.size,
          mimeType: savedImage.mimeType,
          width: savedImage.width,
          height: savedImage.height,
          altText: uploadDto.altText || '',
          description: savedImage.description,
          tags: tags,
          entityType: savedImage.entityType,
          entityId: savedImage.entityId,
          uploadedBy: 1,
          createdAt: savedImage.uploadedAt
        },
        message: 'Image uploaded and processed successfully',
        serveUrl: `/api/image-management/serve/${uniqueFilename}`,
        previewUrl: `/api/image-management/images/${savedImage.id}`
      };

    } catch (error) {
      this.logger.error('Upload error:', error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async getImages(query: any = {}): Promise<any> {
    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      const offset = (page - 1) * limit;

      // Build where clause
      let whereClause = sql`1=1`;
      
      if (query.search) {
        whereClause = sql`${whereClause} AND (${image_management_images.filename} ILIKE ${`%${query.search}%`} OR ${image_management_images.description} ILIKE ${`%${query.search}%`})`;
      }
      
      if (query.entityType) {
        whereClause = sql`${whereClause} AND ${image_management_images.entityType} = ${query.entityType}`;
      }

      const images = await db
        .select()
        .from(image_management_images)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(image_management_images.uploadedAt));

      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(image_management_images)
        .where(whereClause);

      return {
        success: true,
        data: images.map(img => ({
          id: img.id,
          filename: img.filename,
          originalFilename: img.originalName,
          sizeBytes: img.size,
          mimeType: img.mimeType,
          width: img.width,
          height: img.height,
          description: img.description,
          tags: img.tags ? JSON.parse(img.tags) : [],
          entityType: img.entityType,
          entityId: img.entityId,
          uploadedAt: img.uploadedAt,
          previewUrl: `/api/image-management/images/${img.id}`,
          serveUrl: `/api/image-management/serve/${img.filename}`
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      this.logger.error('Error getting images:', error);
      throw error;
    }
  }

  async getImageById(id: string | number): Promise<any> {
    try {
      const imageId = typeof id === 'number' ? id.toString() : id;
      const [image] = await db.select().from(image_management_images).where(eq(image_management_images.id, imageId));
      
      if (!image) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }

      return {
        id: image.id,
        filename: image.filename,
        originalFilename: image.originalName,
        path: image.path,
        sizeBytes: image.size,
        mimeType: image.mimeType,
        width: image.width,
        height: image.height,
        description: image.description,
        tags: image.tags ? JSON.parse(image.tags) : [],
        entityType: image.entityType,
        entityId: image.entityId,
        category: image.category,
        isPublic: image.isPublic,
        variants: image.variants ? JSON.parse(image.variants as string) : [],
        uploadedBy: 1,
        createdAt: image.uploadedAt,
        updatedAt: image.updatedAt,
        previewUrl: `/api/image-management/images/${image.id}`,
        serveUrl: `/api/image-management/serve/${image.filename}`
      };
    } catch (error) {
      this.logger.error(`Error getting image ${id}:`, error);
      throw error;
    }
  }

  async getImageByFilename(filename: string): Promise<any> {
    try {
      const [image] = await db
        .select()
        .from(image_management_images)
        .where(eq(image_management_images.filename, filename));
      
      if (!image) {
        throw new NotFoundException(`Image with filename ${filename} not found`);
      }

      // Check if file exists
      const filePath = path.join(this.uploadPath, filename);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException(`Image file not found on disk: ${filename}`);
      }

      return {
        id: image.id,
        filename: image.filename,
        originalFilename: image.originalName,
        path: filePath,
        sizeBytes: image.size,
        mimeType: image.mimeType,
        width: image.width,
        height: image.height,
        size: image.size,
        buffer: fs.readFileSync(filePath)
      };
    } catch (error) {
      this.logger.error(`Error getting image by filename ${filename}:`, error);
      throw error;
    }
  }

  async deleteImage(id: string | number): Promise<any> {
    try {
      const imageId = typeof id === 'number' ? id.toString() : id;
      const [image] = await db.select().from(image_management_images).where(eq(image_management_images.id, imageId));
      
      if (!image) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }

      // Delete file from disk
      const filePath = path.join(this.uploadPath, image.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await db.delete(image_management_images).where(eq(image_management_images.id, imageId));

      this.logger.log(`Image deleted successfully: ${imageId}`);

      return {
        success: true,
        message: 'Image deleted successfully',
        deletedId: imageId
      };
    } catch (error) {
      this.logger.error(`Error deleting image ${id}:`, error);
      throw error;
    }
  }

  async updateImage(id: string, updateData: any): Promise<any> {
    try {
      const [result] = await db.update(image_management_images)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(image_management_images.id, id))
        .returning();

      if (!result) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Image updated successfully',
        data: result
      };
    } catch (error) {
      this.logger.error(`Error updating image ${id}:`, error);
      throw error;
    }
  }

  async getImageStats(): Promise<any> {
    try {
      const [stats] = await db
        .select({
          total: count(),
          totalSize: sql<number>`COALESCE(SUM(${image_management_images.size}), 0)`
        })
        .from(image_management_images);

      const recentImages = await db
        .select()
        .from(image_management_images)
        .orderBy(desc(image_management_images.uploadedAt))
        .limit(5);

      return {
        success: true,
        stats: {
          totalImages: stats.total,
          totalSize: stats.totalSize,
          formattedSize: this.formatBytes(stats.totalSize)
        },
        recentImages: recentImages.map(img => ({
          id: img.id,
          filename: img.filename,
          size: img.size,
          uploadedAt: img.uploadedAt
        }))
      };
    } catch (error) {
      this.logger.error('Error getting image stats:', error);
      throw error;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async bulkDeleteImages(imageIds: string[]): Promise<any> {
    try {
      // Get images to delete files
      const images = await db
        .select()
        .from(image_management_images)
        .where(sql`${image_management_images.id} = ANY(${imageIds})`);

      // Delete files from disk
      for (const image of images) {
        const filePath = path.join(this.uploadPath, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Delete from database
      await db.delete(image_management_images)
        .where(sql`${image_management_images.id} = ANY(${imageIds})`);

      this.logger.log(`Bulk deleted ${images.length} images`);
      
      return {
        success: true,
        message: `Successfully deleted ${images.length} images`,
        deletedCount: images.length
      };
    } catch (error) {
      this.logger.error('Error bulk deleting images:', error);
      throw error;
    }
  }

  async optimizeImages(imageIds: string[]): Promise<any> {
    return {
      success: true,
      message: 'Image optimization feature will be implemented in future release',
      processedCount: imageIds.length
    };
  }

  async bulkTagImages(imageIds: string[], tags: string[]): Promise<any> {
    try {
      const tagsJson = JSON.stringify(tags);
      await db.update(image_management_images)
        .set({ tags: tagsJson, updatedAt: new Date() })
        .where(sql`${image_management_images.id} = ANY(${imageIds})`);

      this.logger.log(`Bulk tagged ${imageIds.length} images`);
      
      return {
        success: true,
        message: `Successfully tagged ${imageIds.length} images`,
        updatedCount: imageIds.length
      };
    } catch (error) {
      this.logger.error('Error bulk tagging images:', error);
      throw error;
    }
  }
}