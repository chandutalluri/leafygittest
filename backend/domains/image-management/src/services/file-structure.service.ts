import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileStructureService {
  private readonly uploadsDir = path.join(__dirname, '../../uploads');
  
  // Industry-standard directory structure
  private readonly directories = {
    // Main categories
    products: 'products',
    categories: 'categories', 
    brands: 'brands',
    banners: 'banners',
    users: 'users',
    documents: 'documents',
    
    // Processing directories
    originals: 'originals',
    processed: 'processed',
    temp: 'temp',
    archive: 'archive',
    
    // Variant directories (within each category)
    variants: {
      thumbnail: 'thumbnail',    // 150x150
      small: 'small',           // 300x300
      medium: 'medium',         // 600x600
      large: 'large',           // 1200x1200
      xlarge: 'xlarge',         // 2400x2400
      original: 'original'
    }
  };

  async initializeFileStructure(): Promise<void> {
    // Create main directories
    for (const [key, dirName] of Object.entries(this.directories)) {
      if (typeof dirName === 'string') {
        await this.ensureDirectoryExists(path.join(this.uploadsDir, dirName));
        
        // Create variant subdirectories for image categories
        if (['products', 'categories', 'brands', 'banners', 'users'].includes(key)) {
          for (const [variantKey, variantDir] of Object.entries(this.directories.variants)) {
            await this.ensureDirectoryExists(
              path.join(this.uploadsDir, dirName, variantDir)
            );
          }
        }
      }
    }

    // Create processed directory with year/month structure
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    
    await this.ensureDirectoryExists(
      path.join(this.uploadsDir, 'processed', year, month)
    );
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  getUploadPath(entityType: string, variant: string = 'original', filename?: string): string {
    const basePath = path.join(this.uploadsDir, entityType, variant);
    return filename ? path.join(basePath, filename) : basePath;
  }

  getProcessedPath(year?: string, month?: string): string {
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear().toString();
    const targetMonth = month || (currentDate.getMonth() + 1).toString().padStart(2, '0');
    
    return path.join(this.uploadsDir, 'processed', targetYear, targetMonth);
  }

  getTempPath(filename?: string): string {
    const tempDir = path.join(this.uploadsDir, 'temp');
    return filename ? path.join(tempDir, filename) : tempDir;
  }

  getArchivePath(filename?: string): string {
    const archiveDir = path.join(this.uploadsDir, 'archive');
    return filename ? path.join(archiveDir, filename) : archiveDir;
  }

  async cleanupTempFiles(olderThanHours: number = 24): Promise<void> {
    const tempDir = this.getTempPath();
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);

    try {
      const files = await fs.readdir(tempDir);
      
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      console.error('Error cleaning temp files:', error);
    }
  }

  async getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;

    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = await fs.stat(itemPath);
        
        if (stats.isDirectory()) {
          totalSize += await this.getDirectorySize(itemPath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      console.error('Error calculating directory size:', error);
    }

    return totalSize;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}