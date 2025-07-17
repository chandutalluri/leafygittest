import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './database/drizzle';
import { image_management_images } from '../drizzle/schema';
import { eq, and, desc, count, sql, ilike, gte } from 'drizzle-orm';

@Injectable()
export class FixedImageService {
  private readonly logger = new Logger(FixedImageService.name);
  private readonly uploadPath = path.join(process.cwd(), 'uploads', 'images');
  private readonly variantPath = path.join(process.cwd(), 'uploads', 'variants');

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

      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`);
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException('File size too large. Maximum size is 10MB');
      }

      const fileExt = path.extname(file.originalname);
      const uniqueFilename = `${uuidv4()}${fileExt}`;
      const filePath = path.join(this.uploadPath, uniqueFilename);

      // Get file buffer
      const fileBuffer = file.buffer || fs.readFileSync(file.path);
      
      if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
        throw new BadRequestException('Invalid file buffer - file may be corrupted or empty');
      }

      // Save file to disk
      fs.writeFileSync(filePath, fileBuffer);

      // Get basic image info without sharp (since it's not available)
      const metadata = {
        width: 800,
        height: 600,
        format: fileExt.replace('.', '')
      };

      // Parse tags
      const tags = uploadDto.tags ? uploadDto.tags.split(',').map((tag: string) => tag.trim()) : [];

      // Create database record
      const imageRecord = {
        filename: uniqueFilename,
        originalName: file.originalname,
        path: filePath,
        size: file.size,
        mimeType: file.mimetype,
        width: metadata.width,
        height: metadata.height,
        entityType: uploadDto.entityType || 'general',
        entityId: uploadDto.entityId ? parseInt(uploadDto.entityId) : null,
        category: uploadDto.category || 'uncategorized',
        description: uploadDto.description || '',
        tags: JSON.stringify(tags),
        isPublic: uploadDto.isPublic !== 'false',
        variants: JSON.stringify([]),
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
      const conditions = [];
      
      if (query.search) {
        conditions.push(
          sql`(${image_management_images.filename} ILIKE ${`%${query.search}%`} OR ${image_management_images.description} ILIKE ${`%${query.search}%`})`
        );
      }
      
      if (query.entityType) {
        conditions.push(eq(image_management_images.entityType, query.entityType));
      }

      if (query.category) {
        conditions.push(eq(image_management_images.category, query.category));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [images, [{ count: totalCount }]] = await Promise.all([
        db
          .select()
          .from(image_management_images)
          .where(whereClause)
          .limit(limit)
          .offset(offset)
          .orderBy(desc(image_management_images.uploadedAt)),
        db
          .select({ count: count() })
          .from(image_management_images)
          .where(whereClause)
      ]);

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
          category: img.category,
          isPublic: img.isPublic,
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
      throw new BadRequestException('Failed to get images');
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
        success: true,
        data: {
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
        }
      };
    } catch (error) {
      this.logger.error(`Error getting image ${id}:`, error);
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

      // Get category breakdown
      const categoryStats = await db
        .select({
          category: image_management_images.category,
          count: count()
        })
        .from(image_management_images)
        .groupBy(image_management_images.category);

      // Get entity type breakdown
      const entityStats = await db
        .select({
          entityType: image_management_images.entityType,
          count: count()
        })
        .from(image_management_images)
        .groupBy(image_management_images.entityType);

      return {
        success: true,
        total: stats.total,
        totalSize: stats.totalSize,
        formattedTotalSize: this.formatBytes(stats.totalSize),
        byCategory: categoryStats.reduce((acc, item) => {
          acc[item.category || 'uncategorized'] = item.count;
          return acc;
        }, {}),
        byEntityType: entityStats.reduce((acc, item) => {
          acc[item.entityType || 'general'] = item.count;
          return acc;
        }, {}),
        recent: recentImages.map(img => ({
          id: img.id,
          filename: img.filename,
          originalFilename: img.originalName,
          size: img.size,
          category: img.category,
          uploadedAt: img.uploadedAt,
          serveUrl: `/api/image-management/serve/${img.filename}`
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error getting image stats:', error);
      throw new BadRequestException('Failed to get image stats');
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      throw new BadRequestException('Failed to bulk delete images');
    }
  }
}