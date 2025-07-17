/**
 * Simple Traditional Orders API for Local PostgreSQL
 * Serves categories and items data to frontend applications
 */

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3050;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://runner@localhost:5432/leafyhealth'
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'traditional-orders-simple' });
});

// Get categories
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT category as name, category as name_telugu 
      FROM traditional_items 
      WHERE is_active = true 
      ORDER BY category
    `);
    
    const categories = result.rows.map(row => ({
      id: row.name.toLowerCase().replace(/\s+/g, '-'),
      name: row.name,
      name_telugu: row.name_telugu
    }));
    
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get items
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name_english as name,
        name_telugu,
        category,
        unit,
        ordinary_price,
        medium_price,
        best_price,
        is_active
      FROM traditional_items 
      WHERE is_active = true 
      ORDER BY category, name_english
    `);
    
    const items = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      name_telugu: row.name_telugu,
      category: row.category,
      unit: row.unit,
      prices: {
        ordinary: parseFloat(row.ordinary_price),
        medium: parseFloat(row.medium_price),
        best: parseFloat(row.best_price)
      },
      isAvailable: row.is_active
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Root endpoint for gateway routing
app.get('/api/traditional/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT category as name, category as name_telugu 
      FROM traditional_items 
      WHERE is_active = true 
      ORDER BY category
    `);
    
    const categories = result.rows.map(row => ({
      id: row.name.toLowerCase().replace(/\s+/g, '-'),
      name: row.name,
      name_telugu: row.name_telugu
    }));
    
    res.json(categories);
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/traditional/items', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name_english as name,
        name_telugu,
        category,
        unit,
        ordinary_price,
        medium_price,
        best_price,
        is_active
      FROM traditional_items 
      WHERE is_active = true 
      ORDER BY category, name_english
    `);
    
    const items = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      name_telugu: row.name_telugu,
      category: row.category,
      unit: row.unit,
      prices: {
        ordinary: parseFloat(row.ordinary_price),
        medium: parseFloat(row.medium_price),
        best: parseFloat(row.best_price)
      },
      isAvailable: row.is_active
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Items API error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🛒 Traditional Orders API running on port ${PORT}`);
  console.log(`📡 Connected to local PostgreSQL`);
});