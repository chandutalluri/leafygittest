import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFile, Query, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Pool } from 'pg';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

@Controller('image-management')
export class ImageManagementController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'image-management',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      port: process.env.PORT || 3035,
      database: 'connected'
    };
  }

  @Get('images')
  async getAllImages(@Query() query: any) {
    try {
      const result = await pool.query('SELECT * FROM images ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error getting images:', error);
      throw new Error('Failed to get images');
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const result = await pool.query('SELECT COUNT(*) as total, SUM(file_size) as total_size FROM images');
      const total = parseInt(result.rows[0].total) || 0;
      const totalSize = parseInt(result.rows[0].total_size) || 0;
      
      // Get files in directory
      const imagesDir = path.join(process.cwd(), 'uploads', 'images');
      let filesInDirectory = 0;
      
      if (fs.existsSync(imagesDir)) {
        const files = fs.readdirSync(imagesDir).filter(file => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );
        filesInDirectory = files.length;
      }
      
      return {
        total,
        totalSize,
        formattedTotalSize: this.formatBytes(totalSize),
        filesInDirectory,
        byCategory: {},
        byEntityType: {},
        recent: []
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error('Failed to get statistics');
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }

      // Generate unique filename
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      const filename = `${uniqueId}${ext}`;
      
      // Save file to disk
      const uploadDir = path.join(process.cwd(), 'uploads', 'images');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);

      const { alt_text, description, category, entity_type, entity_id, branch_id } = body;

      // Insert into database
      const result = await pool.query(
        `INSERT INTO images (filename, original_name, file_path, file_size, mime_type, alt_text, description, category, entity_type, entity_id, branch_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
         RETURNING *`,
        [filename, file.originalname, filePath, file.size, file.mimetype, alt_text, description, category, entity_type, entity_id, branch_id || 1]
      );

      return {
        success: true,
        image: result.rows[0]
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  @Get('images/:id')
  async getImageById(@Param('id') id: string) {
    try {
      const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Image not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error getting image:', error);
      throw new Error('Failed to get image');
    }
  }

  @Delete('images/:id')
  async deleteImage(@Param('id') id: string) {
    try {
      // Get image info first
      const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        throw new Error('Image not found');
      }
      
      const image = result.rows[0];
      
      // Delete from database
      await pool.query('DELETE FROM images WHERE id = $1', [id]);
      
      // Delete file if exists
      if (fs.existsSync(image.file_path)) {
        fs.unlinkSync(image.file_path);
      }
      
      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  @Get('serve/:filename')
  serveImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const filePath = path.join(imagesDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image file not found' });
    }
    
    res.sendFile(filePath);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}