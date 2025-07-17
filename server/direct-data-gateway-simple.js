/**
 * Simplified Direct Data Gateway - Emergency Fix
 * Serves only essential endpoints for frontend integration
 */

const http = require('http');
const url = require('url');
const { Pool } = require('pg');

const PORT = 8081;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Essential API endpoints
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (pathname === '/api/health') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'direct-data-gateway',
      port: PORT,
      timestamp: new Date().toISOString(),
      database: 'connected',
      endpoints: ['/api/products', '/api/categories', '/api/health']
    }));
    return;
  }

  // Products endpoint
  if (pathname === '/api/products' && req.method === 'GET') {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT 
          id, name, name_telugu, description, description_telugu,
          selling_price as price, mrp as original_price, unit,
          category_id, image_url, is_active, is_featured,
          created_at, updated_at
        FROM products 
        WHERE is_active = true 
        ORDER BY name
      `);
      client.release();

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify(result.rows));
    } catch (error) {
      console.error('Products API error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database error' }));
    }
    return;
  }

  // Categories endpoint
  if (pathname === '/api/categories' && req.method === 'GET') {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT 
          id, name, name_telugu, description, description_telugu,
          icon, color, is_active, created_at, updated_at
        FROM categories 
        WHERE is_active = true 
        ORDER BY name
      `);
      client.release();

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify(result.rows));
    } catch (error) {
      console.error('Categories API error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database error' }));
    }
    return;
  }

  // 404 for unknown endpoints
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Endpoint not found',
    available: ['/api/products', '/api/categories', '/api/health']
  }));
});

// Start server
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Direct Data Gateway running on port ${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  server.close(() => {
    console.log('Direct Data Gateway stopped');
    process.exit(0);
  });
});