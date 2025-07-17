/**
 * STABLE API SERVICE - Simple, reliable data service
 * No complex architecture, just working endpoints
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 8081;

// Simple database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, price, stock_quantity as stock, 
             category_id as category, status, created_at, updated_at
      FROM products 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} products found`
    });
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      details: error.message
    });
  }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, created_at, updated_at
      FROM categories 
      ORDER BY name
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} authentic Telugu categories`
    });
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      details: error.message
    });
  }
});

// Inventory alerts endpoint  
app.get('/api/inventory/alerts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id as product_id, p.name as product_name, 
             i.current_stock, i.minimum_stock as min_threshold,
             'low_stock' as alert_type
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE i.current_stock <= i.minimum_stock
      ORDER BY i.current_stock ASC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      critical: result.rows.length,
      warning: 0
    });
  } catch (error) {
    console.error('Inventory alerts API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory alerts',
      details: error.message
    });
  }
});

// Create product endpoint
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, categoryId, stock } = req.body;
    
    const result = await pool.query(`
      INSERT INTO products (name, description, price, category_id, stock_quantity, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
    `, [name, description, price, categoryId, stock]);
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      details: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ STABLE API SERVICE running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🔄 Stable API service shutting down...');
  pool.end();
  process.exit(0);
});