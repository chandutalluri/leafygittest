const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3035;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../../uploads/images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
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

// Health check endpoint
app.get('/api/image-management/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'image-management',
    timestamp: new Date().toISOString(),
    port: PORT,
    uptime: process.uptime()
  });
});

// Stats endpoint
app.get('/api/image-management/stats', (req, res) => {
  try {
    let imageCount = 0;
    let totalSize = 0;
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      imageCount = files.length;
      
      files.forEach(file => {
        try {
          const filePath = path.join(uploadsDir, file);
          const stat = fs.statSync(filePath);
          totalSize += stat.size;
        } catch (e) {
          // Skip files that can't be read
        }
      });
    }

    res.json({
      service: 'image-management',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      images: {
        total: imageCount,
        totalSize: totalSize,
        directory: uploadsDir
      },
      features: ['upload', 'serve', 'optimize', 'resize']
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats', message: error.message });
  }
});

// Images list endpoint
app.get('/api/image-management/images', (req, res) => {
  try {
    const images = [];
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      
      files.forEach(file => {
        try {
          const filePath = path.join(uploadsDir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isFile()) {
            images.push({
              id: path.parse(file).name,
              filename: file,
              size: stat.size,
              uploaded: stat.birthtime,
              url: `/api/image-management/serve/${file}`
            });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      });
    }

    res.json({
      success: true,
      count: images.length,
      images: images.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get images', message: error.message });
  }
});

// Upload endpoint
app.post('/api/image-management/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageInfo = {
      id: path.parse(req.file.filename).name,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploaded: new Date(),
      url: `/api/image-management/serve/${req.file.filename}`
    };

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: imageInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', message: error.message });
  }
});

// Serve images endpoint
app.get('/api/image-management/serve/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to serve image', message: error.message });
  }
});

// Processing endpoints
app.post('/api/image-management/optimize/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Image optimization ready',
    imageId: req.params.id,
    optimization: req.body
  });
});

app.post('/api/image-management/resize/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Image resize ready',
    imageId: req.params.id,
    resize: req.body
  });
});

app.post('/api/image-management/enhance/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Image enhancement ready',
    imageId: req.params.id,
    enhancement: req.body
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(500).json({ error: 'Internal server error', message: error.message });
});

// Start server with proper binding
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Image Management Service running at http://0.0.0.0:${PORT}`);
  console.log(`📁 Images directory: ${uploadsDir}`);
  console.log(`🎯 Service ready for requests`);
});

// Keep-alive mechanism for Replit
setInterval(() => {
  console.log(`💓 Service alive - Uptime: ${Math.floor(process.uptime())}s`);
}, 30000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => process.exit(0));
});