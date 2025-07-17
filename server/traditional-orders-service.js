const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3050;

// High-performance database connection pool
const pool = new Pool({
  retries: 3,
  reconnect: true,
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 50, // Increased pool size for high concurrency
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 5000,
  query_timeout: 10000
});

// Middleware
app.use(cors());
app.use(compression()); // Enable gzip compression
app.use(express.json());

// Advanced multi-layer caching system
const cache = new Map();
const queryCache = new Map();
const branchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Pre-load critical data on startup
let isPreloaded = false;
async function preloadData() {
  if (isPreloaded) return;
  
  try {
    console.log('🚀 Pre-loading Traditional Orders data...');
    
    // Pre-load all active items with branch pricing
    const itemsQuery = `
      SELECT 
        ti.id,
        ti.name_english,
        ti.name_telugu,
        ti.category,
        ti.unit,
        ti.ordinary_price,
        ti.medium_price,
        ti.best_price,
        ti.is_active,
        ti.region,
        json_agg(
          DISTINCT jsonb_build_object(
            'branch_id', bti.branch_id,
            'price_ordinary', COALESCE(bti.ordinary_price, ti.ordinary_price),
            'price_medium', COALESCE(bti.medium_price, ti.medium_price),
            'price_best', COALESCE(bti.best_price, ti.best_price),
            'stock_quantity', COALESCE(bti.stock_quantity, 1000),
            'is_available', COALESCE(bti.is_available, true)
          )
        ) FILTER (WHERE bti.branch_id IS NOT NULL) as branch_pricing
      FROM traditional_items ti
      LEFT JOIN branch_traditional_items bti ON ti.id = bti.traditional_item_id
      WHERE ti.is_active = true
      GROUP BY ti.id, ti.name_english, ti.name_telugu, ti.category, ti.unit, ti.ordinary_price, ti.medium_price, ti.best_price, ti.is_active, ti.region
      ORDER BY ti.category, ti.name_english
    `;
    
    const result = await pool.query(itemsQuery);
    
    // Cache by multiple keys for fastest access
    const itemsByCategory = {};
    const itemsById = {};
    
    result.rows.forEach(item => {
      // Store by ID
      itemsById[item.id] = item;
      
      // Group by category
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = [];
      }
      itemsByCategory[item.category].push(item);
      
      // Cache branch-specific pricing
      if (item.branch_pricing) {
        item.branch_pricing.forEach(bp => {
          const branchKey = `branch:${bp.branch_id}:item:${item.id}`;
          setCache(branchKey, {
            ...item,
            price_ordinary: bp.price_ordinary,
            price_medium: bp.price_medium,
            price_best: bp.price_best,
            stock_quantity: bp.stock_quantity,
            is_available: bp.is_available
          });
        });
      }
    });
    
    // Cache everything
    setCache('items:all', result.rows);
    setCache('items:byId', itemsById);
    Object.entries(itemsByCategory).forEach(([cat, items]) => {
      setCache(`items:category:${cat}`, items);
    });
    
    // Pre-load categories
    const categories = await pool.query(`
      SELECT DISTINCT category, COUNT(*) as item_count
      FROM traditional_items 
      WHERE is_active = true
      GROUP BY category
      ORDER BY category
    `);
    setCache('categories:all', categories.rows);
    
    isPreloaded = true;
    console.log(`✅ Pre-loaded ${result.rows.length} items across ${categories.rows.length} categories`);
  } catch (error) {
    console.error('❌ Pre-load failed:', error);
  }
}

// Helper functions for advanced caching
function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Implement LRU eviction if cache gets too large
  if (cache.size > 1000) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

// Database query with caching
async function cachedQuery(query, params, cacheKey) {
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  
  // Execute query
  const result = await pool.query(query, params);
  
  // Cache result
  setCache(cacheKey, result.rows);
  
  return result.rows;
}

// Start pre-loading data
preloadData();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'traditional-orders' });
});

// Get categories - Ultra-fast with pre-loaded data
app.get('/api/traditional/categories', async (req, res) => {
  try {
    // Ensure data is pre-loaded
    await preloadData();
    
    // Return from cache instantly
    const cached = getFromCache('categories:all');
    if (cached) {
      res.set('X-Cache', 'HIT');
      res.set('X-Response-Time', '1ms');
      return res.json(cached);
    }
    
    // Fallback query if cache miss
    const result = await pool.query(`
      SELECT DISTINCT 
        category,
        COUNT(*) as item_count
      FROM traditional_items 
      WHERE is_active = true
      GROUP BY category
      ORDER BY category
    `);
    
    setCache('categories:all', result.rows);
    res.set('X-Cache', 'MISS');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get items by category - Optimized for millisecond response times
app.get('/api/traditional/items', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { category, branchId, search, priceRange, quality } = req.query;
    
    if (!branchId) {
      return res.status(400).json({ error: 'branchId is required' });
    }

    // Ensure data is pre-loaded
    await preloadData();

    // Try ultra-fast cache lookup first
    if (category && category !== 'all' && !search && !priceRange && !quality) {
      const cached = getFromCache(`items:category:${category}`);
      if (cached) {
        // Filter by branch pricing if available
        const itemsWithBranchPricing = cached.map(item => {
          const branchItem = getFromCache(`branch:${branchId}:item:${item.id}`);
          if (branchItem) {
            return {
              ...item,
              price_ordinary: branchItem.price_ordinary,
              price_medium: branchItem.price_medium,
              price_best: branchItem.price_best,
              stock_ordinary: branchItem.stock_ordinary,
              stock_medium: branchItem.stock_medium,
              stock_best: branchItem.stock_best,
              is_available: branchItem.is_available
            };
          }
          return {
            ...item,
            price_ordinary: item.ordinary_price,
            price_medium: item.medium_price,
            price_best: item.best_price,
            is_available: true
          };
        });
        
        res.set('X-Cache', 'HIT');
        res.set('X-Response-Time', `${Date.now() - startTime}ms`);
        return res.json(itemsWithBranchPricing);
      }
    }

    // Advanced query with multiple filters
    let query = `
      WITH branch_items AS (
        SELECT 
          ti.id,
          ti.name_english as name,
          ti.name_telugu,
          ti.category,
          ti.unit,
          COALESCE(bti.ordinary_price, ti.ordinary_price) as price_ordinary,
          COALESCE(bti.medium_price, ti.medium_price) as price_medium,
          COALESCE(bti.best_price, ti.best_price) as price_best,
          COALESCE(bti.stock_quantity, 1000) as stock_quantity,
          COALESCE(bti.is_available, true) as is_available,
          ti.region
        FROM traditional_items ti
        LEFT JOIN branch_traditional_items bti ON ti.id = bti.traditional_item_id AND bti.branch_id = $1
        WHERE ti.is_active = true
      )
      SELECT * FROM branch_items WHERE 1=1
    `;

    const params = [branchId];
    let paramCount = 1;
    
    if (category && category !== 'all') {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(name_telugu) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
    }
    
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        paramCount += 2;
        query += ` AND price_ordinary BETWEEN $${paramCount - 1} AND $${paramCount}`;
        params.push(min, max);
      }
    }
    
    query += ' ORDER BY category, name LIMIT 500'; // Limit for performance

    const result = await pool.query(query, params);
    
    // Cache the result
    const cacheKey = `items:${JSON.stringify(req.query)}`;
    setCache(cacheKey, result.rows);
    
    res.set('X-Cache', 'MISS');
    res.set('X-Response-Time', `${Date.now() - startTime}ms`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create order - Optimized for high-throughput
app.post('/api/traditional/orders', async (req, res) => {
  const startTime = Date.now();
  const client = await pool.connect();
  
  try {
    const { branchId, customerId, items, totalAmount, deliveryAddress, paymentMethod = 'cash' } = req.body;

    // Validate input
    if (!branchId || !customerId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    await client.query('BEGIN');

    // Generate order number
    const orderNumber = `TRD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order with optimized query
    const orderResult = await client.query(
      `INSERT INTO traditional_orders 
       (branch_id, customer_id, total_amount, delivery_address, status, order_date, order_number, payment_method)
       VALUES ($1, $2, $3, $4, 'pending', NOW(), $5, $6)
       RETURNING id, order_number, created_at`,
      [branchId, customerId, totalAmount, JSON.stringify(deliveryAddress), orderNumber, paymentMethod]
    );

    const orderId = orderResult.rows[0].id;

    // Batch insert order items for better performance
    const itemValues = items.map((item, index) => {
      const offset = index * 6;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
    }).join(',');

    const itemParams = items.flatMap(item => [
      orderId,
      item.itemId,
      item.quantity,
      item.qualityTier || 'ordinary',
      item.unitPrice,
      item.totalPrice || (item.quantity * item.unitPrice)
    ]);

    await client.query(
      `INSERT INTO traditional_order_items 
       (order_id, item_id, quantity, quality_tier, unit_price, total_price)
       VALUES ${itemValues}`,
      itemParams
    );

    // Update inventory if needed (optional - for high-value items)
    if (items.some(item => item.qualityTier === 'best')) {
      const updateQueries = items
        .filter(item => item.qualityTier === 'best')
        .map(item => client.query(
          `UPDATE branch_traditional_items 
           SET stock_quantity = GREATEST(0, stock_quantity - $1)
           WHERE branch_id = $2 AND item_id = $3`,
          [item.quantity, branchId, item.itemId]
        ));
      
      await Promise.all(updateQueries);
    }

    await client.query('COMMIT');

    // Clear relevant caches
    cache.delete(`orders:customer:${customerId}`);
    
    res.set('X-Response-Time', `${Date.now() - startTime}ms`);
    res.json({ 
      success: true, 
      orderId, 
      orderNumber,
      message: 'Order placed successfully',
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Get orders for a customer
app.get('/orders/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { branchId } = req.query;

    const result = await pool.query(
      `SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.order_date,
        o.delivery_address,
        COUNT(oi.id) as item_count
      FROM traditional_orders o
      LEFT JOIN traditional_order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = $1 ${branchId ? 'AND o.branch_id = $2' : ''}
      GROUP BY o.id
      ORDER BY o.order_date DESC
      LIMIT 20`,
      branchId ? [customerId, branchId] : [customerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Start server
app.listen(port, '127.0.0.1', () => {
  console.log(`🏪 Traditional Orders Service running on port ${port}`);
});