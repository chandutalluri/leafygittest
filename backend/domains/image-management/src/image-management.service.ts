import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { db } from './database/drizzle';
import { image_management_images } from '../drizzle/schema';
import { eq, and, desc, count, sql, ilike, gte, isNotNull } from 'drizzle-orm';

export interface ImageVariant {
  type: string;
  filename: string;
  width: number;
  height: number;
  size: number;
  quality: number;
}

@Injectable()
export class ImageManagementService {
  private readonly logger = new Logger(ImageManagementService.name);
  private readonly uploadPath = process.env.UPLOAD_DIR || 'uploads/images';
  private readonly variantPath = process.env.VARIANT_DIR || 'uploads/variants';
  private readonly tempPath = process.env.TEMP_DIR || 'uploads/temp';
  
  private readonly variants = [
    { name: 'thumbnail', width: 200, height: 200 },
    { name: 'small', width: 400, height: 400 },
    { name: 'medium', width: 800, height: 600 },
    { name: 'large', width: 1200, height: 900 }
  ];

  constructor(private configService: ConfigService) {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [this.uploadPath, this.variantPath, this.tempPath];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    });
  }

  private async generateImageVariants(originalPath: string, filename: string): Promise<string[]> {
    const generatedVariants: string[] = [];
    
    try {
      const image = sharp(originalPath);
      
      for (const variant of this.variants) {
        const variantFilename = `${variant.name}-${filename}`;
        const variantPath = path.join(this.variantPath, variantFilename);
        
        await image
          .resize({
            width: variant.width,
            height: variant.height,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toFile(variantPath);
          
        generatedVariants.push(variantFilename);
        this.logger.log(`Generated variant: ${variantFilename}`);
      }
      
      return generatedVariants;
    } catch (error) {
      this.logger.error(`Error generating variants for ${filename}:`, error);
      return [];
    }
  }

  async uploadImage(file: any, uploadDto: any): Promise<any> {
    try {
      this.logger.log(`Processing upload: ${file.originalname}`);

      if (!file || !file.buffer) {
        throw new BadRequestException('No valid file provided');
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

      // Create upload directory
      const uploadDir = path.join(process.cwd(), 'uploads', 'images');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const fileExt = path.extname(file.originalname);
      const uniqueFilename = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Get image dimensions
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Parse tags
      let tags = [];
      if (uploadDto.tags) {
        if (Array.isArray(uploadDto.tags)) {
          tags = uploadDto.tags;
        } else {
          tags = uploadDto.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }

      // Prepare image record for database
      const imageRecord = {
        filename: uniqueFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        width: metadata.width || 0,
        height: metadata.height || 0,
        path: `/uploads/images/${uniqueFilename}`,
        entityType: uploadDto.entityType || 'general',
        entityId: uploadDto.entityId ? parseInt(uploadDto.entityId) : null,
        category: uploadDto.category || 'general',
        description: uploadDto.description || '',
        tags: JSON.stringify(tags),
        isPublic: uploadDto.isPublic !== 'false',
        variants: JSON.stringify([]),
        uploadedAt: new Date(),
        updatedAt: new Date()
      };

      // Insert into database using the correct table name
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

  async getImagePreview(id: number): Promise<any> {
    try {
      const [image] = await db.select().from(image_management_images).where(eq(image_management_images.id, id.toString()));
      
      if (!image) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }

      // Create serve URL for the image  
      const serveUrl = `http://localhost:5000/api/image-management/serve/${image.filename}`;
      
      return {
        id: image.id,
        filename: image.filename,
        originalFilename: image.originalName,
        path: image.path,
        serveUrl,
        sizeBytes: image.size,
        mimeType: image.mimeType,
        width: image.width,
        height: image.height,
        description: image.description,
        tags: Array.isArray(image.tags) ? image.tags : (image.tags ? JSON.parse(image.tags) : []),
        entityType: image.entityType,
        entityId: image.entityId,
        category: image.category,
        isPublic: image.isPublic,
        variants: Array.isArray(image.variants) ? image.variants : (image.variants ? JSON.parse(image.variants) : []),
        uploadedBy: 1,
        createdAt: image.uploadedAt,
        updatedAt: image.updatedAt,
        formattedSize: this.formatBytes(image.size || 0)
      };
    } catch (error) {
      this.logger.error(`Error getting preview for image ${id}:`, error);
      throw error;
    }
  }

  async getImageById(id: string | number): Promise<any> {
    try {
      const imageId = typeof id === 'string' ? parseInt(id) : id;
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
        tags: Array.isArray(image.tags) ? image.tags : (image.tags ? JSON.parse(image.tags) : []),
        entityType: image.entityType,
        entityId: image.entityId,
        category: image.category,
        isPublic: image.isPublic,
        variants: Array.isArray(image.variants) ? image.variants : (image.variants ? JSON.parse(image.variants) : []),
        uploadedBy: 1,
        createdAt: image.uploadedAt,
        updatedAt: image.updatedAt
      };
    } catch (error) {
      this.logger.error(`Error getting image ${id}:`, error);
      throw error;
    }
  }

  async getImages(query: any): Promise<any> {
    try {
      const {
        page = 1,
        limit = 50,
        category,
        entityType,
        entityId,
        isPublic,
        search,
        sortBy = 'uploadedAt',
        sortOrder = 'desc',
        format,
        dateRange,
        sizeRange
      } = query;

      const offset = (page - 1) * limit;
      const conditions = [];

      if (category) {
        conditions.push(eq(image_management_images.category, category));
      }
      if (entityType) {
        conditions.push(eq(image_management_images.entityType, entityType));
      }
      if (entityId) {
        conditions.push(eq(image_management_images.entityId, parseInt(entityId)));
      }
      if (isPublic !== undefined) {
        conditions.push(eq(image_management_images.isPublic, isPublic === 'true'));
      }
      if (search) {
        conditions.push(
          sql`(${image_management_images.originalName} ILIKE ${`%${search}%`} OR 
               ${image_management_images.description} ILIKE ${`%${search}%`} OR 
               ${image_management_images.tags}::text ILIKE ${`%${search}%`})`
        );
      }
      if (format) {
        conditions.push(ilike(image_management_images.mimeType, `%${format}%`));
      }
      
      // Date range filtering
      if (dateRange && dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        }
        
        if (startDate) {
          conditions.push(gte(image_management_images.uploadedAt, startDate));
        }
      }

      // Size range filtering
      if (sizeRange && sizeRange !== 'all') {
        switch (sizeRange) {
          case 'small':
            conditions.push(sql`${image_management_images.size} < 102400`); // < 100KB
            break;
          case 'medium':
            conditions.push(sql`${image_management_images.size} >= 102400 AND ${image_management_images.size} <= 1048576`); // 100KB - 1MB
            break;
          case 'large':
            conditions.push(sql`${image_management_images.size} > 1048576`); // > 1MB
            break;
        }
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [imageList, [{ count: totalCount }]] = await Promise.all([
        db.select()
          .from(image_management_images)
          .where(whereClause)
          .orderBy(sortOrder === 'desc' ? desc(image_management_images[sortBy]) : image_management_images[sortBy])
          .limit(limit)
          .offset(offset),
        db.select({ count: count() })
          .from(image_management_images)
          .where(whereClause)
      ]);

      return {
        images: imageList.map(img => ({
          id: img.id,
          filename: img.filename,
          originalFilename: img.originalName,
          path: img.path,
          sizeBytes: img.size,
          mimeType: img.mimeType,
          width: img.width,
          height: img.height,
          altText: img.description,
          description: img.description,
          tags: Array.isArray(img.tags) ? img.tags : (img.tags ? JSON.parse(img.tags) : []),
          entityType: img.entityType,
          entityId: img.entityId,
          uploadedBy: 1,
          createdAt: img.uploadedAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit)
        },
        filters: {
          applied: { category, entityType, search, format, dateRange, sizeRange },
          sortBy,
          sortOrder
        }
      };

    } catch (error) {
      this.logger.error('Error fetching images:', error);
      throw new BadRequestException('Failed to fetch images');
    }
  }

  async bulkDeleteImages(imageIds: string[]): Promise<any> {
    try {
      const deletedCount = await db.delete(image_management_images)
        .where(sql`${image_management_images.id} = ANY(${imageIds})`);

      this.logger.log(`Bulk deleted ${deletedCount} images`);
      
      return {
        success: true,
        deleted: deletedCount,
        message: `Successfully deleted ${deletedCount} images`
      };
    } catch (error) {
      this.logger.error('Bulk delete error:', error);
      throw new BadRequestException('Failed to delete images');
    }
  }

  async optimizeImages(imageIds: string[]): Promise<any> {
    try {
      let optimizedCount = 0;
      
      for (const imageId of imageIds) {
        const [image] = await db.select().from(image_management_images).where(eq(image_management_images.id, imageId));
        
        if (image && fs.existsSync(image.path)) {
          // Re-generate optimized variants
          await this.generateImageVariants(image.path, image.filename);
          optimizedCount++;
        }
      }

      this.logger.log(`Optimized ${optimizedCount} images`);
      
      return {
        success: true,
        optimized: optimizedCount,
        message: `Successfully optimized ${optimizedCount} images`
      };
    } catch (error) {
      this.logger.error('Optimization error:', error);
      throw new BadRequestException('Failed to optimize images');
    }
  }

  async bulkTagImages(imageIds: string[], tags: string[]): Promise<any> {
    try {
      const updatedCount = await db.update(image_management_images)
        .set({ 
          tags: JSON.stringify(tags),
          updatedAt: new Date()
        })
        .where(sql`${image_management_images.id} = ANY(${imageIds})`);

      this.logger.log(`Added tags to ${updatedCount} images`);
      
      return {
        success: true,
        updated: updatedCount,
        message: `Successfully added tags to ${updatedCount} images`
      };
    } catch (error) {
      this.logger.error('Bulk tag error:', error);
      throw new BadRequestException('Failed to add tags');
    }
  }

  async getImagePreview(imageId: number): Promise<any> {
    try {
      const [image] = await db.select().from(image_management_images).where(eq(image_management_images.id, imageId.toString()));
      
      if (!image) {
        throw new NotFoundException(`Image with ID ${imageId} not found`);
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
        altText: image.description,
        description: image.description,
        tags: Array.isArray(image.tags) ? image.tags : (image.tags ? JSON.parse(image.tags) : []),
        entityType: image.entityType,
        entityId: image.entityId,
        category: image.category,
        isPublic: image.isPublic,
        variants: Array.isArray(image.variants) ? image.variants : (image.variants ? JSON.parse(image.variants) : []),
        uploadedBy: 1,
        createdAt: image.uploadedAt,
        updatedAt: image.updatedAt,
        serveUrl: `/api/image-management/serve/${image.filename}`,
        previewUrl: `/api/image-management/images/${image.id}/preview`
      };
    } catch (error) {
      this.logger.error(`Error getting image preview ${imageId}:`, error);
      throw error;
    }
  }

  async getImageAnalytics(): Promise<any> {
    try {
      const [
        totalImages,
        totalSize,
        formatStats,
        categoryStats,
        uploadTrends
      ] = await Promise.all([
        db.select({ count: count() }).from(images),
        db.select({ total: sql`sum(${images.size})` }).from(images),
        db.select({ 
          format: images.mimeType,
          count: count(),
          totalSize: sql`sum(${images.size})`
        }).from(images).groupBy(images.mimeType),
        db.select({
          category: images.entityType,
          count: count(),
          avgSize: sql`avg(${images.size})`
        }).from(images).groupBy(images.entityType),
        db.select({
          date: sql`date_trunc('day', ${images.uploadedAt})`,
          count: count()
        }).from(images)
        .where(gte(images.uploadedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
        .groupBy(sql`date_trunc('day', ${images.uploadedAt})`)
        .orderBy(sql`date_trunc('day', ${images.uploadedAt})`)
      ]);

      return {
        overview: {
          totalImages: totalImages[0].count,
          totalSize: totalSize[0].total || 0,
          formattedTotalSize: this.formatBytes(totalSize[0].total || 0)
        },
        byFormat: formatStats,
        byCategory: categoryStats,
        uploadTrends: uploadTrends,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Analytics error:', error);
      throw new BadRequestException('Failed to get analytics');
    }
  }

  async updateImage(id: string, updateData: any): Promise<any> {
    try {
      const imageId = parseInt(id);
      const [updatedImage] = await db.update(images)
        .set({
          description: updateData.description,
          category: updateData.category,
          tags: updateData.tags ? (Array.isArray(updateData.tags) ? updateData.tags : [updateData.tags]) : undefined,
          isPublic: updateData.isPublic,
          entityType: updateData.entityType,
          entityId: updateData.entityId,
          updatedAt: new Date()
        })
        .where(eq(images.id, imageId))
        .returning();

      return {
        success: true,
        image: updatedImage,
        message: 'Image updated successfully'
      };
    } catch (error) {
      this.logger.error(`Error updating image ${id}:`, error);
      throw new BadRequestException('Failed to update image');
    }
  }

  async deleteImage(id: string | number): Promise<any> {
    try {
      const imageId = typeof id === 'string' ? parseInt(id) : id;
      const [image] = await db.select().from(images).where(eq(images.id, imageId));
      
      if (!image) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }

      // Delete file from filesystem
      const filePath = path.join(process.cwd(), 'backend/domains/image-management', image.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await db.delete(images).where(eq(images.id, imageId));

      return {
        success: true,
        deletedImage: image,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      this.logger.error(`Error deleting image ${id}:`, error);
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

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff',
      '.ico': 'image/x-icon'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  async bulkDeleteImages(imageIds: number[]): Promise<any> {
    try {
      let deletedCount = 0;
      const errors = [];
      const deletedImages = [];

      for (const id of imageIds) {
        try {
          const result = await this.deleteImage(id);
          if (result.success) {
            deletedCount++;
            deletedImages.push(result.deletedImage);
          }
        } catch (error) {
          errors.push(`Failed to delete image ${id}: ${error.message}`);
          this.logger.error(`Bulk delete error for image ${id}:`, error);
        }
      }

      return {
        success: true,
        deleted: deletedCount,
        total: imageIds.length,
        deletedImages,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully deleted ${deletedCount} of ${imageIds.length} images`
      };
    } catch (error) {
      this.logger.error('Error in bulk delete:', error);
      throw new BadRequestException(`Bulk delete failed: ${error.message}`);
    }
  }

  async optimizeImages(imageIds: number[]): Promise<any> {
    try {
      let optimizedCount = 0;
      const errors = [];

      for (const id of imageIds) {
        try {
          const [image] = await db.select().from(images).where(eq(images.id, id));
          if (image) {
            // Generate optimized variants
            const imagePath = path.join(this.uploadsDir, 'products', image.filename);
            if (fs.existsSync(imagePath)) {
              await this.generateImageVariants(imagePath, image.filename);
              optimizedCount++;
            }
          }
        } catch (error) {
          errors.push(`Failed to optimize image ${id}: ${error.message}`);
          this.logger.error(`Optimize error for image ${id}:`, error);
        }
      }

      return {
        success: true,
        optimized: optimizedCount,
        total: imageIds.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully optimized ${optimizedCount} of ${imageIds.length} images`
      };
    } catch (error) {
      this.logger.error('Error in bulk optimize:', error);
      throw new BadRequestException(`Bulk optimize failed: ${error.message}`);
    }
  }

  async bulkTagImages(imageIds: number[], tags: string[]): Promise<any> {
    try {
      let taggedCount = 0;
      const errors = [];

      for (const id of imageIds) {
        try {
          const [image] = await db.select().from(images).where(eq(images.id, id));
          if (image) {
            const existingTags = image.tags || [];
            const newTags = [...new Set([...existingTags, ...tags])];
            
            await db.update(images)
              .set({ tags: newTags })
              .where(eq(images.id, id));
            taggedCount++;
          }
        } catch (error) {
          errors.push(`Failed to tag image ${id}: ${error.message}`);
          this.logger.error(`Tag error for image ${id}:`, error);
        }
      }

      return {
        success: true,
        tagged: taggedCount,
        total: imageIds.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully tagged ${taggedCount} of ${imageIds.length} images`
      };
    } catch (error) {
      this.logger.error('Error in bulk tag:', error);
      throw new BadRequestException(`Bulk tag failed: ${error.message}`);
    }
  }

  async getImageStats(): Promise<any> {
    try {
      const [
        [{ total }],
        [{ totalSize }],
        categories,
        entityTypes,
        recent
      ] = await Promise.all([
        db.select({ total: count() }).from(images),
        db.select({ totalSize: sql<number>`sum(${images.size})` }).from(images),
        db.select({
          category: images.category,
          count: count()
        })
          .from(images)
          .where(isNotNull(images.category))
          .groupBy(images.category),
        db.select({
          entityType: images.entityType,
          count: count()
        })
          .from(images)
          .where(isNotNull(images.entityType))
          .groupBy(images.entityType),
        db.select()
          .from(images)
          .orderBy(desc(images.uploadedAt))
          .limit(5)
      ]);

      // Parse tags from database and count them
      const allImages = await db.select({ tags: images.tags }).from(images).where(isNotNull(images.tags));
      const tagCounts = {};
      
      allImages.forEach(img => {
        let tags = [];
        try {
          tags = Array.isArray(img.tags) ? img.tags : JSON.parse(img.tags || '[]');
        } catch (e) {
          tags = img.tags ? img.tags.split(',').map(t => t.trim()) : [];
        }
        
        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      return {
        total,
        totalSize: totalSize || 0,
        byCategory: tagCounts,
        byEntityType: Object.fromEntries(entityTypes.map(e => [e.entityType, e.count])),
        recent: recent.map(img => ({
          id: img.id,
          filename: img.filename,
          originalFilename: img.originalName,
          path: img.path,
          sizeBytes: img.size,
          mimeType: img.mimeType,
          width: img.width,
          height: img.height,
          altText: img.description,
          description: img.description,
          tags: Array.isArray(img.tags) ? img.tags : (img.tags ? JSON.parse(img.tags) : []),
          entityType: img.entityType,
          entityId: img.entityId,
          uploadedBy: 1,
          createdAt: img.uploadedAt
        })),
        formattedTotalSize: this.formatBytes(totalSize || 0),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error fetching image stats:', error);
      throw new BadRequestException('Failed to fetch image stats');
    }
  }.count
        })),
        entityTypes: entityTypes.map(e => ({
          name: e.entityType,
          count: e.count
        })),
        recent: recent.map(img => ({
          id: img.id,
          filename: img.filename,
          originalName: img.originalName,
          uploadedAt: img.uploadedAt
        }))
      };

    } catch (error) {
      this.logger.error('Error fetching image stats:', error);
      throw new BadRequestException('Failed to fetch image statistics');
    }
  }

  async getImageAnalytics(query: any): Promise<any> {
    try {
      const { period = '7d', entityType, category } = query;
      
      const days = period === '30d' ? 30 : 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const conditions = [gte(images.uploadedAt, startDate)];
      
      if (entityType) {
        conditions.push(eq(images.entityType, entityType));
      }
      if (category) {
        conditions.push(eq(images.category, category));
      }

      const analytics = await db.select({
        date: sql<string>`date(${images.uploadedAt})`,
        count: count(),
        totalSize: sql<number>`sum(${images.size})`
      })
        .from(images)
        .where(and(...conditions))
        .groupBy(sql`date(${images.uploadedAt})`)
        .orderBy(sql`date(${images.uploadedAt})`);

      return {
        period,
        analytics: analytics.map(a => ({
          date: a.date,
          uploads: a.count,
          totalSize: a.totalSize || 0
        }))
      };

    } catch (error) {
      this.logger.error('Error fetching analytics:', error);
      throw new BadRequestException('Failed to fetch analytics');
    }
  }

  async getImagesByEntity(entityType: string, entityId: number, query: any): Promise<any> {
    try {
      const { category, isPublic, limit = 50 } = query;
      
      const conditions = [
        eq(images.entityType, entityType),
        eq(images.entityId, entityId)
      ];

      if (category) {
        conditions.push(eq(images.category, category));
      }
      if (isPublic !== undefined) {
        conditions.push(eq(images.isPublic, isPublic === 'true'));
      }

      const entityImages = await db.select()
        .from(images)
        .where(and(...conditions))
        .orderBy(desc(images.uploadedAt))
        .limit(limit);

      return {
        entityType,
        entityId,
        images: entityImages
      };

    } catch (error) {
      this.logger.error('Error fetching entity images:', error);
      throw new BadRequestException('Failed to fetch entity images');
    }
  }

  async serveImage(filename: string, options: any = {}): Promise<any> {
    try {
      const { variant, quality, format } = options;
      
      let imagePath: string;
      
      if (variant && variant !== 'original') {
        const variantFilename = `${variant}-${filename}`;
        imagePath = path.join(this.variantPath, variantFilename);
        
        if (!fs.existsSync(imagePath)) {
          const originalPath = path.join(this.uploadPath, filename);
          if (fs.existsSync(originalPath)) {
            await this.generateImageVariants(originalPath, filename);
          }
        }
      } else {
        imagePath = path.join(this.uploadPath, filename);
      }

      if (!fs.existsSync(imagePath)) {
        throw new NotFoundException('Image not found');
      }

      const stats = fs.statSync(imagePath);
      const fileBuffer = fs.readFileSync(imagePath);
      
      let processedBuffer = fileBuffer;
      let mimeType = this.getMimeType(filename);

      if (quality || format) {
        const image = sharp(fileBuffer);
        
        if (quality) {
          image.jpeg({ quality: parseInt(quality) });
        }
        
        if (format === 'webp') {
          image.webp();
          mimeType = 'image/webp';
        } else if (format === 'png') {
          image.png();
          mimeType = 'image/png';
        }
        
        processedBuffer = await image.toBuffer();
      }

      return {
        buffer: processedBuffer,
        mimeType,
        size: processedBuffer.length,
        etag: `"${stats.mtime.getTime()}"`,
        lastModified: stats.mtime.toUTCString()
      };

    } catch (error) {
      this.logger.error(`Error serving image ${filename}:`, error);
      throw new NotFoundException('Image not found or processing failed');
    }
  }

  async getImageVariants(filename: string): Promise<any> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.filename, filename))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      const variants = [];
      
      for (const variant of this.variants) {
        const variantFilename = `${variant.name}-${filename}`;
        const variantPath = path.join(this.variantPath, variantFilename);
        
        if (fs.existsSync(variantPath)) {
          const stats = fs.statSync(variantPath);
          variants.push({
            type: variant.name,
            filename: variantFilename,
            width: variant.width,
            height: variant.height,
            size: stats.size,
            url: `/api/image-management/serve/${filename}?variant=${variant.name}`
          });
        }
      }

      return {
        filename,
        original: {
          width: image.width,
          height: image.height,
          size: image.size,
          url: `/api/image-management/serve/${filename}`
        },
        variants
      };

    } catch (error) {
      this.logger.error(`Error getting variants for ${filename}:`, error);
      throw new NotFoundException('Image variants not found');
    }
  }

  async getImageById(id: number): Promise<ImageRecord> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.id, id))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      return image;

    } catch (error) {
      this.logger.error(`Error fetching image ${id}:`, error);
      throw new NotFoundException('Image not found');
    }
  }

  async updateImage(id: number, updateDto: any): Promise<ImageRecord> {
    try {
      const [updatedImage] = await db.update(images)
        .set({
          ...updateDto,
          updatedAt: new Date()
        })
        .where(eq(images.id, id))
        .returning();

      if (!updatedImage) {
        throw new NotFoundException('Image not found');
      }

      return updatedImage;

    } catch (error) {
      this.logger.error(`Error updating image ${id}:`, error);
      throw new BadRequestException('Failed to update image');
    }
  }

  async deleteImage(id: number): Promise<any> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.id, id))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      const originalPath = path.join(this.uploadPath, image.filename);
      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      if (image.variants) {
        for (const variant of image.variants) {
          const variantPath = path.join(this.variantPath, variant);
          if (fs.existsSync(variantPath)) {
            fs.unlinkSync(variantPath);
          }
        }
      }

      await db.delete(images).where(eq(images.id, id));

      return {
        success: true,
        message: 'Image deleted successfully',
        deletedId: id
      };

    } catch (error) {
      this.logger.error(`Error deleting image ${id}:`, error);
      throw new BadRequestException('Failed to delete image');
    }
  }

  async bulkDelete(ids: number[]): Promise<any> {
    try {
      const results = [];
      
      for (const id of ids) {
        try {
          const result = await this.deleteImage(id);
          results.push({ id, success: true });
        } catch (error) {
          results.push({ id, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        total: ids.length,
        successful,
        failed,
        results
      };

    } catch (error) {
      this.logger.error('Error in bulk delete:', error);
      throw new BadRequestException('Bulk delete failed');
    }
  }

  async reprocessImage(id: number): Promise<any> {
    try {
      const [image] = await db.select()
        .from(images)
        .where(eq(images.id, id))
        .limit(1);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      const originalPath = path.join(this.uploadPath, image.filename);
      if (!fs.existsSync(originalPath)) {
        throw new NotFoundException('Original image file not found');
      }

      const variants = await this.generateImageVariants(originalPath, image.filename);

      await db.update(images)
        .set({
          variants,
          updatedAt: new Date()
        })
        .where(eq(images.id, id));

      return {
        success: true,
        message: 'Image reprocessed successfully',
        variants: variants.length
      };

    } catch (error) {
      this.logger.error(`Error reprocessing image ${id}:`, error);
      throw new BadRequestException('Failed to reprocess image');
    }
  }

  async createBackup(includeFiles: boolean = false): Promise<any> {
    try {
      const allImages = await db.select().from(images);
      
      const backup = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        totalImages: allImages.length,
        metadata: allImages
      };

      const backupFilename = `image-backup-${Date.now()}.json`;
      const backupPath = path.join(this.tempPath, backupFilename);
      
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

      return {
        success: true,
        message: 'Backup created successfully',
        filename: backupFilename,
        path: backupPath,
        totalImages: allImages.length,
        includeFiles
      };

    } catch (error) {
      this.logger.error('Error creating backup:', error);
      throw new BadRequestException('Failed to create backup');
    }
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}