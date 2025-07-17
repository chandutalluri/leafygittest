import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createReadStream } from 'fs';

export interface ImageRecord {
  id: number;
  filename: string;
  originalFilename: string;
  path: string;
  sizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
  description?: string;
  tags?: string[];
  entityType?: string;
  entityId?: number;
  uploadedBy?: number;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class ImageService {
  private readonly uploadsPath = join(process.cwd(), 'backend', 'domains', 'image-management', 'uploads', 'products', 'original');

  async findAll(): Promise<ImageRecord[]> {
    // Get actual files from disk to provide real image management
    const fs = require('fs');
    const path = require('path');
    
    try {
      const files = fs.readdirSync(this.uploadsPath);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      
      return imageFiles.map((filename, index) => {
        const filePath = path.join(this.uploadsPath, filename);
        const stats = fs.statSync(filePath);
        
        return {
          id: index + 1,
          filename,
          originalFilename: filename,
          path: `/api/image-management/serve/${filename}`,
          sizeBytes: stats.size,
          mimeType: this.getMimeType(filename),
          width: 800,
          height: 600,
          altText: this.generateAltText(filename),
          description: this.generateDescription(filename),
          tags: this.generateTags(filename),
          entityType: 'product',
          entityId: index + 1,
          uploadedBy: 1,
          createdAt: stats.birthtime || new Date(),
        };
      });
    } catch (error) {
      console.error('Error reading image files:', error);
      return [];
    }
  }

  private getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  private generateAltText(filename: string): string {
    const name = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/[-_]/g, ' ');
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  private generateDescription(filename: string): string {
    const name = this.generateAltText(filename);
    return `High-quality image of ${name} for e-commerce display`;
  }

  private generateTags(filename: string): string[] {
    const name = filename.toLowerCase();
    const tags = [];
    
    if (name.includes('organic')) tags.push('organic');
    if (name.includes('spinach')) tags.push('spinach', 'leafy-greens');
    if (name.includes('pepper')) tags.push('peppers', 'vegetables');
    if (name.includes('rice')) tags.push('rice', 'grains');
    if (name.includes('coconut')) tags.push('coconut', 'oil');
    if (name.includes('fruit')) tags.push('fruits');
    
    return tags.length > 0 ? tags : ['product', 'food'];
  }

  async findById(id: number): Promise<ImageRecord | null> {
    const images = await this.findAll();
    return images.find(img => img.id === id) || null;
  }

  async findByFilename(filename: string): Promise<ImageRecord | null> {
    const images = await this.findAll();
    return images.find(img => img.filename === filename) || null;
  }

  async getImageStream(filename: string) {
    const imagePath = join(this.uploadsPath, filename);
    
    try {
      await fs.access(imagePath);
      return createReadStream(imagePath);
    } catch (error) {
      // Return a placeholder SVG if image not found
      throw new Error(`Image not found: ${filename}`);
    }
  }

  async getImageStats() {
    const images = await this.findAll();
    
    return {
      total: images.length,
      totalSize: images.reduce((sum, img) => sum + img.sizeBytes, 0),
      byCategory: this.getCategoryBreakdown(images),
      byEntityType: this.getEntityTypeBreakdown(images),
      recent: images.slice(-5),
    };
  }

  private getCategoryBreakdown(images: ImageRecord[]) {
    const categories = {};
    images.forEach(img => {
      if (img.tags) {
        img.tags.forEach(tag => {
          categories[tag] = (categories[tag] || 0) + 1;
        });
      }
    });
    return categories;
  }

  private getEntityTypeBreakdown(images: ImageRecord[]) {
    const entityTypes = {};
    images.forEach(img => {
      if (img.entityType) {
        entityTypes[img.entityType] = (entityTypes[img.entityType] || 0) + 1;
      }
    });
    return entityTypes;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}