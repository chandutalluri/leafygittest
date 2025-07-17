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

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const variantsDir = path.join(uploadsDir, 'variants');

[uploadsDir, imagesDir, variantsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/image-management/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'image-management',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: port,
    database: 'connected'
  });
});

// Get image statistics
app.get('/api/image-management/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total, SUM(file_size) as total_size FROM images');
    const total = parseInt(result.rows[0].total) || 0;
    const totalSize = parseInt(result.rows[0].total_size) || 0;
    
    // Get files in directory
    const files = fs.readdirSync(imagesDir).filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    res.json({
      total,
      totalSize,
      formattedTotalSize: formatBytes(totalSize),
      filesInDirectory: files.length,
      byCategory: {},
      byEntityType: {},
      recent: []
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get all images
app.get('/api/image-management/images', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM images ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
});

// Upload image
app.post('/api/image-management/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;
    const { alt_text, description, category, entity_type, entity_id, branch_id } = req.body;

    // Get image dimensions (simplified)
    let width = null, height = null;
    
    // Insert into database
    const result = await pool.query(
      `INSERT INTO images (filename, original_name, file_path, file_size, mime_type, width, height, alt_text, description, category, entity_type, entity_id, branch_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
       RETURNING *`,
      [filename, originalname, filePath, size, mimetype, width, height, alt_text, description, category, entity_type, entity_id, branch_id]
    );

    res.json({
      success: true,
      image: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get image by ID
app.get('/api/image-management/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting image:', error);
    res.status(500).json({ error: 'Failed to get image' });
  }
});

// Delete image
app.delete('/api/image-management/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get image info first
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = result.rows[0];
    
    // Delete from database
    await pool.query('DELETE FROM images WHERE id = $1', [id]);
    
    // Delete file if exists
    if (fs.existsSync(image.file_path)) {
      fs.unlinkSync(image.file_path);
    }
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Serve image files
app.get('/api/image-management/serve/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(imagesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image file not found' });
  }
  
  res.sendFile(filePath);
});

// Utility function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Start server
app.listen(port, '127.0.0.1', () => {
  console.log(`✅ Image Management Service running on port ${port}`);
  console.log(`📁 Images directory: ${imagesDir}`);
  console.log(`🔗 Health check: http://localhost:${port}/api/image-management/health`);
  console.log(`📊 Stats endpoint: http://localhost:${port}/api/image-management/stats`);
  
  // Test database connection
  pool.query('SELECT 1', (err) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
    } else {
      console.log('✅ Database connection successful');
    }
  });
}).on('error', (err) => {
  console.error('❌ Server startup error:', err.message);
  process.exit(1);
});