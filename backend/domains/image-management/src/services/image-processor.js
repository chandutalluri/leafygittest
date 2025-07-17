const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

class ImageProcessor {
  constructor() {
    this.sizes = {
      thumbnail: { width: 150, height: 150 },
      small: { width: 300, height: 300 },
      medium: { width: 600, height: 600 },
      large: { width: 1200, height: 1200 },
      xl: { width: 1920, height: 1920 }
    };
    
    this.quality = {
      jpeg: 85,
      webp: 90,
      png: 95
    };
  }

  async processImage(inputPath, outputDir, originalName) {
    try {
      const stats = fs.statSync(inputPath);
      const baseFilename = path.parse(originalName).name;
      const results = {
        original: {
          path: inputPath,
          size: stats.size,
          width: 'auto',
          height: 'auto',
          format: path.extname(originalName).slice(1)
        },
        optimized: {},
        thumbnails: {}
      };

      // Create output directories
      const optimizedDir = path.join(outputDir, 'optimized');
      const thumbnailsDir = path.join(outputDir, 'thumbnails');
      
      [optimizedDir, thumbnailsDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      // Generate optimized versions
      await this.generateOptimizedVersions(inputPath, optimizedDir, baseFilename, results);
      
      // Generate thumbnails
      await this.generateThumbnails(inputPath, thumbnailsDir, baseFilename, results);

      return results;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }

  async generateOptimizedVersions(inputPath, outputDir, baseFilename, results) {
    const formats = ['jpeg', 'webp', 'png'];
    
    for (const format of formats) {
      try {
        const outputPath = path.join(outputDir, `${baseFilename}-optimized.${format}`);
        
        // Simple file copy for now (can be enhanced with actual optimization)
        fs.copyFileSync(inputPath, outputPath);
        
        const stats = fs.statSync(outputPath);
        
        results.optimized[format] = {
          path: outputPath,
          size: stats.size,
          width: 'auto',
          height: 'auto',
          compressionRatio: '0'
        };
      } catch (error) {
        console.error(`Error generating ${format} version:`, error);
      }
    }
  }

  async generateThumbnails(inputPath, outputDir, baseFilename, results) {
    for (const [sizeName, dimensions] of Object.entries(this.sizes)) {
      try {
        const outputPath = path.join(outputDir, `${baseFilename}-${sizeName}.webp`);
        
        // Simple file copy for now (can be enhanced with actual resizing)
        fs.copyFileSync(inputPath, outputPath);

        const stats = fs.statSync(outputPath);
        
        results.thumbnails[sizeName] = {
          path: outputPath,
          size: stats.size,
          width: dimensions.width,
          height: dimensions.height
        };
      } catch (error) {
        console.error(`Error generating ${sizeName} thumbnail:`, error);
      }
    }
  }

  async enhanceImage(inputPath, outputPath, options = {}) {
    try {
      // Simple file copy for now (can be enhanced with actual image processing)
      fs.copyFileSync(inputPath, outputPath);
      
      const stats = fs.statSync(outputPath);
      
      return {
        path: outputPath,
        size: stats.size,
        width: 'auto',
        height: 'auto',
        enhancements: options
      };
    } catch (error) {
      console.error('Error enhancing image:', error);
      throw error;
    }
  }

  async resizeImage(inputPath, outputPath, width, height, options = {}) {
    try {
      // Simple file copy for now (can be enhanced with actual resizing)
      fs.copyFileSync(inputPath, outputPath);
      
      const stats = fs.statSync(outputPath);
      
      return {
        path: outputPath,
        size: stats.size,
        width: parseInt(width),
        height: parseInt(height),
        originalWidth: width,
        originalHeight: height
      };
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }

  async optimizeExistingImage(inputPath, outputPath) {
    try {
      // Simple file copy for now (can be enhanced with actual optimization)
      fs.copyFileSync(inputPath, outputPath);
      
      const originalStats = fs.statSync(inputPath);
      const optimizedStats = fs.statSync(outputPath);
      
      return {
        originalSize: originalStats.size,
        optimizedSize: optimizedStats.size,
        compressionRatio: '0',
        path: outputPath
      };
    } catch (error) {
      console.error('Error optimizing existing image:', error);
      throw error;
    }
  }

  async getImageMetadata(imagePath) {
    try {
      const stats = fs.statSync(imagePath);
      
      return {
        filename: path.basename(imagePath),
        size: stats.size,
        width: 'auto',
        height: 'auto',
        format: path.extname(imagePath).slice(1),
        channels: 'auto',
        density: 'auto',
        hasAlpha: false,
        aspectRatio: '1.0'
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      throw error;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = ImageProcessor;