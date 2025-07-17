const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const cors = require('cors');
const ImageProcessor = require('./services/image-processor');

const app = express();
const PORT = process.env.PORT || 3035;
const imageProcessor = new ImageProcessor();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../../../uploads');
const imagesDir = path.join(uploadsDir, 'images');

[uploadsDir, imagesDir].forEach(dir => {
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

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes with proper /api/image-management prefix
app.get('/api/image-management/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'image-management',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: PORT,
    database: 'connected'
  });
});

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

app.get('/api/image-management/images', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM images ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
});

app.post('/api/image-management/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;
    const { alt_text, description, category, entity_type, entity_id, branch_id } = req.body;

    // Process image with optimization and thumbnails
    const processedImage = await imageProcessor.processImage(filePath, imagesDir, originalname);
    
    // Insert into database with processed image data
    const result = await pool.query(
      `INSERT INTO images (filename, original_name, file_path, file_size, mime_type, alt_text, description, category, entity_type, entity_id, branch_id, processed_data) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [filename, originalname, filePath, size, mimetype, alt_text, description, category, entity_type, entity_id, branch_id, JSON.stringify(processedImage)]
    );

    res.json({
      success: true,
      image: result.rows[0],
      processing: processedImage
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

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

app.get('/api/image-management/serve/:filename', (req, res) => {
  const { filename } = req.params;
  const { size, format } = req.query;
  let filePath;
  
  // Determine file path based on size and format
  if (size && ['thumbnail', 'small', 'medium', 'large', 'xl'].includes(size)) {
    const baseFilename = path.parse(filename).name;
    filePath = path.join(imagesDir, 'thumbnails', `${baseFilename}-${size}.webp`);
  } else if (format && ['jpeg', 'webp', 'png'].includes(format)) {
    const baseFilename = path.parse(filename).name;
    filePath = path.join(imagesDir, 'optimized', `${baseFilename}-optimized.${format}`);
  } else {
    filePath = path.join(imagesDir, filename);
  }
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image file not found' });
  }
  
  res.sendFile(filePath);
});

// New endpoint for image optimization
app.post('/api/image-management/optimize/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quality, format } = req.body;
    
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = result.rows[0];
    const optimizedPath = path.join(imagesDir, 'optimized', `${path.parse(image.filename).name}-custom.${format || 'webp'}`);
    
    const optimized = await imageProcessor.optimizeExistingImage(image.file_path, optimizedPath);
    
    res.json({
      success: true,
      optimized,
      originalSize: imageProcessor.formatBytes(optimized.originalSize),
      optimizedSize: imageProcessor.formatBytes(optimized.optimizedSize)
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    res.status(500).json({ error: 'Failed to optimize image' });
  }
});

// New endpoint for image resizing
app.post('/api/image-management/resize/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { width, height, quality, format } = req.body;
    
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = result.rows[0];
    const resizedPath = path.join(imagesDir, 'resized', `${path.parse(image.filename).name}-${width}x${height}.${format || 'webp'}`);
    
    // Ensure resized directory exists
    const resizedDir = path.join(imagesDir, 'resized');
    if (!fs.existsSync(resizedDir)) {
      fs.mkdirSync(resizedDir, { recursive: true });
    }
    
    const resized = await imageProcessor.resizeImage(image.file_path, resizedPath, width, height, { quality });
    
    res.json({
      success: true,
      resized,
      originalSize: imageProcessor.formatBytes(resized.size)
    });
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).json({ error: 'Failed to resize image' });
  }
});

// New endpoint for image enhancement
app.post('/api/image-management/enhance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { brightness, contrast, saturation, sharpen, blur, removeNoise } = req.body;
    
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = result.rows[0];
    const enhancedPath = path.join(imagesDir, 'enhanced', `${path.parse(image.filename).name}-enhanced.webp`);
    
    // Ensure enhanced directory exists
    const enhancedDir = path.join(imagesDir, 'enhanced');
    if (!fs.existsSync(enhancedDir)) {
      fs.mkdirSync(enhancedDir, { recursive: true });
    }
    
    const enhanced = await imageProcessor.enhanceImage(image.file_path, enhancedPath, {
      brightness, contrast, saturation, sharpen, blur, removeNoise
    });
    
    res.json({
      success: true,
      enhanced,
      originalSize: imageProcessor.formatBytes(enhanced.size)
    });
  } catch (error) {
    console.error('Error enhancing image:', error);
    res.status(500).json({ error: 'Failed to enhance image' });
  }
});

// New endpoint for image metadata
app.get('/api/image-management/metadata/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(imagesDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image file not found' });
    }
    
    const metadata = await imageProcessor.getImageMetadata(filePath);
    res.json(metadata);
  } catch (error) {
    console.error('Error getting image metadata:', error);
    res.status(500).json({ error: 'Failed to get image metadata' });
  }
});

// Utility function
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Image Management Service running on port ${PORT}`);
  console.log(`📁 Images directory: ${imagesDir}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/image-management/health`);
  console.log(`📊 Stats endpoint: http://localhost:${PORT}/api/image-management/stats`);
  
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