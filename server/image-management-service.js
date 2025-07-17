const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');

const app = express();
const port = 3035;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/images');
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

const upload = multer({ storage });

app.use(express.json());

// Health check endpoint
app.get('/api/image-management/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'image-management',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: port
  });
});

// Get image statistics
app.get('/api/image-management/stats', async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) as total, SUM(size) as total_size FROM image_management_images';
    const result = await pool.query(query);
    const { total, total_size } = result.rows[0];
    
    const categoryQuery = 'SELECT category, COUNT(*) as count FROM image_management_images GROUP BY category';
    const categoryResult = await pool.query(categoryQuery);
    
    const byCategory = {};
    categoryResult.rows.forEach(row => {
      byCategory[row.category] = parseInt(row.count);
    });
    
    res.json({
      total: parseInt(total) || 0,
      totalSize: parseInt(total_size) || 0,
      formattedTotalSize: formatBytes(parseInt(total_size) || 0),
      byCategory,
      byEntityType: {},
      recent: []
    });
  } catch (error) {
    console.error('Error fetching image stats:', error);
    res.json({
      total: 0,
      totalSize: 0,
      formattedTotalSize: '0 Bytes',
      byCategory: {},
      byEntityType: {},
      recent: []
    });
  }
});

// Upload image endpoint
app.post('/api/image-management/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { description, category, entityType, tags } = req.body;
    
    // Insert image record into database
    const query = `
      INSERT INTO image_management_images (
        filename, original_name, mime_type, size, path, 
        entity_type, category, description, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      req.file.path,
      entityType || 'general',
      category || 'general',
      description || '',
      tags || ''
    ];
    
    const result = await pool.query(query, values);
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Get all images
app.get('/api/image-management/images', async (req, res) => {
  try {
    const query = 'SELECT * FROM image_management_images ORDER BY created_at DESC';
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching images',
      error: error.message
    });
  }
});

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Image Management Service running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/image-management/health`);
});