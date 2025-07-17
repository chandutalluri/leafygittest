import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface ImageVariant {
  name: string;
  width: number;
  height?: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

interface OptimizationOptions {
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  progressive?: boolean;
  removeMetadata?: boolean;
}

@Injectable()
export class ImageOptimizationService {
  private readonly variants: Record<string, ImageVariant> = {
    thumbnail: { name: 'thumbnail', width: 150, height: 150, quality: 80, format: 'jpeg' },
    small: { name: 'small', width: 300, height: 300, quality: 85, format: 'jpeg' },
    medium: { name: 'medium', width: 600, height: 600, quality: 85, format: 'jpeg' },
    large: { name: 'large', width: 1200, height: 1200, quality: 90, format: 'jpeg' },
    xlarge: { name: 'xlarge', width: 2400, height: 2400, quality: 95, format: 'jpeg' },
    
    // PWA optimized variants
    'pwa-icon-192': { name: 'pwa-icon-192', width: 192, height: 192, quality: 90, format: 'png' },
    'pwa-icon-512': { name: 'pwa-icon-512', width: 512, height: 512, quality: 90, format: 'png' },
    
    // Mobile optimized variants
    'mobile-thumb': { name: 'mobile-thumb', width: 120, height: 120, quality: 75, format: 'webp' },
    'mobile-card': { name: 'mobile-card', width: 400, height: 400, quality: 80, format: 'webp' },
    
    // Product catalog variants
    'product-grid': { name: 'product-grid', width: 250, height: 250, quality: 80, format: 'jpeg' },
    'product-detail': { name: 'product-detail', width: 800, height: 800, quality: 90, format: 'jpeg' },
    'product-zoom': { name: 'product-zoom', width: 1600, height: 1600, quality: 95, format: 'jpeg' }
  };

  async processImage(
    inputBuffer: Buffer,
    outputDir: string,
    filename: string,
    entityType: string = 'products',
    generateVariants: boolean = true
  ): Promise<{
    original: string;
    variants: Record<string, string>;
    metadata: any;
  }> {
    try {
      // Get image metadata
      const metadata = await sharp(inputBuffer).metadata();
      
      // Generate unique filename if not provided
      const baseFilename = filename || `${uuidv4()}.jpg`;
      const nameWithoutExt = path.parse(baseFilename).name;
      
      // Save original image (optimized)
      const originalPath = path.join(outputDir, 'original', baseFilename);
      await this.ensureDirectoryExists(path.dirname(originalPath));
      
      await sharp(inputBuffer)
        .jpeg({ quality: 95, progressive: true })
        .toFile(originalPath);

      const variants: Record<string, string> = {};

      if (generateVariants) {
        // Generate all variants
        for (const [variantName, config] of Object.entries(this.variants)) {
          const variantFilename = `${nameWithoutExt}_${variantName}.${config.format}`;
          const variantPath = path.join(outputDir, variantName, variantFilename);
          
          await this.ensureDirectoryExists(path.dirname(variantPath));
          
          let sharpInstance = sharp(inputBuffer);

          // Resize image
          if (config.height) {
            sharpInstance = sharpInstance.resize(config.width, config.height, {
              fit: 'cover',
              position: 'center'
            });
          } else {
            sharpInstance = sharpInstance.resize(config.width, null, {
              fit: 'inside',
              withoutEnlargement: true
            });
          }

          // Apply format-specific optimizations
          switch (config.format) {
            case 'jpeg':
              sharpInstance = sharpInstance.jpeg({
                quality: config.quality,
                progressive: true,
                mozjpeg: true
              });
              break;
            case 'webp':
              sharpInstance = sharpInstance.webp({
                quality: config.quality,
                effort: 6
              });
              break;
            case 'png':
              sharpInstance = sharpInstance.png({
                compressionLevel: 9,
                adaptiveFiltering: true
              });
              break;
          }

          await sharpInstance.toFile(variantPath);
          variants[variantName] = variantFilename;
        }
      }

      return {
        original: baseFilename,
        variants,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: metadata.size,
          density: metadata.density,
          hasAlpha: metadata.hasAlpha,
          channels: metadata.channels
        }
      };

    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async optimizeExistingImage(
    inputPath: string,
    outputPath: string,
    options: OptimizationOptions = {}
  ): Promise<void> {
    const {
      quality = 85,
      format = 'jpeg',
      progressive = true,
      removeMetadata = true
    } = options;

    let sharpInstance = sharp(inputPath);

    if (!removeMetadata) {
      sharpInstance = sharpInstance.withMetadata();
    }

    switch (format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({
          quality,
          progressive,
          mozjpeg: true
        });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({
          quality,
          effort: 6
        });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({
          compressionLevel: 9,
          adaptiveFiltering: true
        });
        break;
    }

    await sharpInstance.toFile(outputPath);
  }

  async generateResponsiveVariants(
    inputBuffer: Buffer,
    outputDir: string,
    baseFilename: string,
    screens: string[] = ['mobile', 'tablet', 'desktop']
  ): Promise<Record<string, Record<string, string>>> {
    const responsiveVariants: Record<string, Record<string, string>> = {};

    const screenConfigs = {
      mobile: [
        { suffix: 'thumb', width: 120, quality: 75 },
        { suffix: 'card', width: 300, quality: 80 },
        { suffix: 'hero', width: 600, quality: 85 }
      ],
      tablet: [
        { suffix: 'thumb', width: 150, quality: 80 },
        { suffix: 'card', width: 400, quality: 85 },
        { suffix: 'hero', width: 800, quality: 90 }
      ],
      desktop: [
        { suffix: 'thumb', width: 200, quality: 85 },
        { suffix: 'card', width: 500, quality: 90 },
        { suffix: 'hero', width: 1200, quality: 95 }
      ]
    };

    for (const screen of screens) {
      if (screenConfigs[screen]) {
        responsiveVariants[screen] = {};
        
        for (const config of screenConfigs[screen]) {
          const filename = `${baseFilename}_${screen}_${config.suffix}.jpg`;
          const outputPath = path.join(outputDir, screen, filename);
          
          await this.ensureDirectoryExists(path.dirname(outputPath));
          
          await sharp(inputBuffer)
            .resize(config.width, null, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({
              quality: config.quality,
              progressive: true,
              mozjpeg: true
            })
            .toFile(outputPath);

          responsiveVariants[screen][config.suffix] = filename;
        }
      }
    }

    return responsiveVariants;
  }

  async createWatermarkedImage(
    inputBuffer: Buffer,
    watermarkPath: string,
    outputPath: string,
    position: 'northeast' | 'northwest' | 'southeast' | 'southwest' | 'center' = 'southeast'
  ): Promise<void> {
    await sharp(inputBuffer)
      .composite([{
        input: watermarkPath,
        gravity: position,
        blend: 'over'
      }])
      .jpeg({ quality: 90 })
      .toFile(outputPath);
  }

  async analyzeImageQuality(inputPath: string): Promise<{
    sharpness: number;
    brightness: number;
    contrast: number;
    recommendations: string[];
  }> {
    const metadata = await sharp(inputPath).metadata();
    const stats = await sharp(inputPath).stats();
    
    const recommendations: string[] = [];
    
    // Analyze image dimensions
    if (metadata.width && metadata.width < 800) {
      recommendations.push('Consider using higher resolution images for better quality');
    }
    
    // Analyze image format
    if (metadata.format === 'png' && !metadata.hasAlpha) {
      recommendations.push('Convert to JPEG for better compression without quality loss');
    }
    
    // Analyze file size vs quality
    if (metadata.size && metadata.size > 500000) { // 500KB
      recommendations.push('Image size is large, consider optimization');
    }

    return {
      sharpness: this.calculateSharpness(stats),
      brightness: this.calculateBrightness(stats),
      contrast: this.calculateContrast(stats),
      recommendations
    };
  }

  private calculateSharpness(stats: any): number {
    // Simplified sharpness calculation based on standard deviation
    return Math.min(100, (stats.channels[0].std / 50) * 100);
  }

  private calculateBrightness(stats: any): number {
    // Calculate brightness based on mean pixel value
    return (stats.channels[0].mean / 255) * 100;
  }

  private calculateContrast(stats: any): number {
    // Calculate contrast based on standard deviation
    return Math.min(100, (stats.channels[0].std / 128) * 100);
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  getVariantConfig(variantName: string): ImageVariant | null {
    return this.variants[variantName] || null;
  }

  getAllVariants(): Record<string, ImageVariant> {
    return this.variants;
  }

  getMimeType(format: string): string {
    const mimeTypes = {
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif'
    };
    return mimeTypes[format.toLowerCase()] || 'application/octet-stream';
  }

  validateImage(buffer: Buffer): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        sharp(buffer)
          .metadata()
          .then((metadata) => {
            resolve(
              metadata.format !== undefined &&
              metadata.width !== undefined &&
              metadata.height !== undefined &&
              metadata.width > 0 &&
              metadata.height > 0
            );
          })
          .catch(() => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  async createResponsiveVariants(
    inputBuffer: Buffer,
    outputDir: string,
    baseFilename: string,
    entityType: string = 'products'
  ): Promise<Record<string, string>> {
    const variants: Record<string, string> = {};
    const nameWithoutExt = path.parse(baseFilename).name;

    // Create product-specific responsive variants
    const responsiveConfigs = {
      'mobile-thumb': { width: 120, height: 120, quality: 75, format: 'webp' as const },
      'mobile-card': { width: 300, height: 300, quality: 80, format: 'webp' as const },
      'tablet-card': { width: 400, height: 400, quality: 85, format: 'jpeg' as const },
      'desktop-grid': { width: 250, height: 250, quality: 80, format: 'jpeg' as const },
      'desktop-detail': { width: 800, height: 800, quality: 90, format: 'jpeg' as const }
    };

    for (const [variantName, config] of Object.entries(responsiveConfigs)) {
      const variantFilename = `${nameWithoutExt}_${variantName}.${config.format}`;
      const variantPath = path.join(outputDir, variantName, variantFilename);
      
      await this.ensureDirectoryExists(path.dirname(variantPath));
      
      await sharp(inputBuffer)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: config.quality, progressive: true })
        .toFile(variantPath);

      variants[variantName] = variantFilename;
    }

    return variants;
  }
}