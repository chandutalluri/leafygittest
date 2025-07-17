const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const axios = require('axios');

const app = express();
const port = process.env.TRADITIONAL_ORDERS_PORT || 3050;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs from environment or defaults
const MARKETPLACE_SERVICE_URL = process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:3033';
const ORDER_MANAGEMENT_URL = process.env.ORDER_MANAGEMENT_URL || 'http://localhost:3030';
const MULTI_LANGUAGE_URL = process.env.MULTI_LANGUAGE_URL || 'http://localhost:3019';
const PAYMENT_PROCESSING_URL = process.env.PAYMENT_PROCESSING_URL || 'http://localhost:3031';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3032';
const SHIPPING_DELIVERY_URL = process.env.SHIPPING_DELIVERY_URL || 'http://localhost:3034';
const IDENTITY_ACCESS_URL = process.env.IDENTITY_ACCESS_URL || 'http://localhost:3020';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'traditional-orders',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get quality tiers
app.get('/quality-tiers', (req, res) => {
  res.json({
    tiers: [
      {
        id: 'ordinary',
        name: 'Ordinary Quality',
        symbol: '₹',
        description: 'Most economical option',
        multiplier: 1.0
      },
      {
        id: 'medium',
        name: 'Medium Quality',
        symbol: '₹₹',
        description: 'Good quality assurance',
        multiplier: 1.25
      },
      {
        id: 'best',
        name: 'Best Quality',
        symbol: '₹₹₹',
        description: 'Premium/Organic quality',
        multiplier: 1.6
      }
    ]
  });
});

// Get traditional items with branch-specific pricing
app.get('/items', async (req, res) => {
  try {
    const { category, region = 'AP_TG', branchId } = req.query;
    
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Branch ID is required' 
      });
    }
    
    // Convert branchId to integer
    const branchIdInt = parseInt(branchId, 10);
    if (isNaN(branchIdInt)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid branch ID format' 
      });
    }

    // First check if branch offers traditional orders
    const branchCheck = await pool.query(`
      SELECT settings->>'services' as services 
      FROM branches 
      WHERE id = $1 AND is_active = true
    `, [branchIdInt]);

    if (branchCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Branch not found' 
      });
    }

    const services = JSON.parse(branchCheck.rows[0].services || '{}');
    if (!services.traditional_orders) {
      return res.status(403).json({ 
        success: false, 
        error: 'Traditional orders service not available at this branch' 
      });
    }

    // Build query for items with branch-specific pricing
    let query = `
      SELECT 
        ti.*,
        bti.ordinary_price as branch_ordinary_price,
        bti.medium_price as branch_medium_price,
        bti.best_price as branch_best_price,
        bti.stock_quantity,
        bti.is_available as branch_available,
        bti.min_order_quantity,
        bti.max_order_quantity
      FROM traditional_items ti
      INNER JOIN branch_traditional_items bti ON ti.id = bti.item_id
      WHERE bti.branch_id = $1 
        AND ti.is_active = true 
        AND bti.is_available = true
        AND ti.region = $2
    `;
    const params = [branchIdInt, region];
    
    if (category) {
      query += ` AND ti.category = $3`;
      params.push(category);
    }
    
    query += ` ORDER BY ti.category, ti.name_english`;
    
    const result = await pool.query(query, params);
    res.json({
      success: true,
      data: result.rows,
      branchId: branchId  // Keep original string branchId for response
    });
  } catch (error) {
    console.error('Error fetching traditional items:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch items' 
    });
  }
});

// Get item categories for a specific branch
app.get('/categories', async (req, res) => {
  try {
    const { branchId } = req.query;
    
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Branch ID is required' 
      });
    }
    
    // Convert branchId to integer
    const branchIdInt = parseInt(branchId, 10);
    if (isNaN(branchIdInt)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid branch ID format' 
      });
    }

    // Check if branch offers traditional orders
    const branchCheck = await pool.query(`
      SELECT settings->>'services' as services 
      FROM branches 
      WHERE id = $1 AND is_active = true
    `, [branchIdInt]);

    if (branchCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Branch not found' 
      });
    }

    const services = JSON.parse(branchCheck.rows[0].services || '{}');
    if (!services.traditional_orders) {
      return res.status(403).json({ 
        success: false, 
        error: 'Traditional orders service not available at this branch' 
      });
    }

    // Get categories with branch-specific item counts
    const result = await pool.query(`
      SELECT DISTINCT ti.category, COUNT(*) as item_count
      FROM traditional_items ti
      INNER JOIN branch_traditional_items bti ON ti.id = bti.item_id
      WHERE ti.is_active = true 
        AND bti.branch_id = $1
        AND bti.is_available = true
      GROUP BY ti.category
      ORDER BY ti.category
    `, [branchIdInt]);
    
    const categoryDetails = {
      'grains': { 
        name_english: 'Grains & Cereals', 
        name_telugu: 'ధాన్యాలు',
        icon: '🌾'
      },
      'pulses': { 
        name_english: 'Pulses & Lentils', 
        name_telugu: 'పప్పుధాన్యాలు',
        icon: '🫘'
      },
      'spices': { 
        name_english: 'Spices & Condiments', 
        name_telugu: 'మసాలాలు',
        icon: '🌶️'
      },
      'oils': { 
        name_english: 'Cooking Oils', 
        name_telugu: 'వంట నూనెలు',
        icon: '🛢️'
      },
      'essentials': { 
        name_english: 'Household Essentials', 
        name_telugu: 'గృహావసరాలు',
        icon: '🏠'
      },
      'dry_fruits': { 
        name_english: 'Dry Fruits & Nuts', 
        name_telugu: 'ఎండు పండ్లు',
        icon: '🥜'
      }
    };
    
    const categories = result.rows.map(row => ({
      ...row,
      ...categoryDetails[row.category] || {}
    }));
    
    res.json({
      success: true,
      data: categories,
      branchId: branchId
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    });
  }
});

// Create traditional order with branch-specific pricing
app.post('/orders', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      customer_id,
      branch_id,
      quality_tier,
      items,
      delivery_address,
      notes
    } = req.body;
    
    if (!branch_id) {
      throw new Error('Branch ID is required');
    }

    // Check if branch offers traditional orders
    const branchCheck = await client.query(`
      SELECT settings->>'services' as services 
      FROM branches 
      WHERE id = $1 AND is_active = true
    `, [branch_id]);

    if (branchCheck.rows.length === 0) {
      throw new Error('Branch not found');
    }

    const services = JSON.parse(branchCheck.rows[0].services || '{}');
    if (!services.traditional_orders) {
      throw new Error('Traditional orders service not available at this branch');
    }
    
    // Calculate total amount based on branch-specific pricing and quality tier
    let totalAmount = 0;
    const priceColumn = `branch_${quality_tier}_price`;
    
    for (const item of items) {
      const itemResult = await client.query(
        `SELECT bti.${quality_tier}_price as price 
         FROM branch_traditional_items bti
         WHERE bti.branch_id = $1 AND bti.item_id = $2 AND bti.is_available = true`,
        [branch_id, item.item_id]
      );
      
      if (itemResult.rows.length > 0) {
        const price = parseFloat(itemResult.rows[0].price);
        totalAmount += price * item.quantity;
        item.unit_price = price;
        item.total_price = price * item.quantity;
      } else {
        throw new Error(`Item ${item.item_id} not available at this branch`);
      }
    }
    
    // Request vendor selection from Marketplace Management
    const vendorResponse = await axios.post(`${MARKETPLACE_SERVICE_URL}/vendor-selection`, {
      order_type: 'traditional',
      quality_tier,
      total_amount: totalAmount,
      items: items.map(item => ({ id: item.item_id, quantity: item.quantity })),
      delivery_address
    }).catch(err => {
      console.log('Vendor selection service not available, using default');
      return { data: { vendor_id: 1 } }; // Default vendor
    });
    
    const selectedVendorId = vendorResponse.data.vendor_id;
    
    // Create traditional order with branch_id
    const orderResult = await client.query(
      `INSERT INTO traditional_orders 
       (customer_id, branch_id, quality_tier, total_amount, selected_vendor_id, delivery_address, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [customer_id, branch_id, quality_tier, totalAmount, selectedVendorId, delivery_address, notes]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO traditional_order_items 
         (order_id, item_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.item_id, item.quantity, item.unit_price, item.total_price]
      );
    }
    
    await client.query('COMMIT');
    
    // Send to Order Management for processing
    try {
      await axios.post(`${ORDER_MANAGEMENT_URL}/process-traditional-order`, {
        traditional_order_id: orderId,
        ...orderResult.rows[0]
      });
    } catch (err) {
      console.log('Order management service integration pending');
    }
    
    // Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/send`, {
        type: 'order_confirmation',
        recipient: customer_id,
        data: {
          order_id: orderId,
          total_amount: totalAmount,
          quality_tier
        }
      });
    } catch (err) {
      console.log('Notification service integration pending');
    }
    
    res.json({
      success: true,
      data: {
        order_id: orderId,
        ...orderResult.rows[0]
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating traditional order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create order' 
    });
  } finally {
    client.release();
  }
});

// Get order details
app.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order details
    const orderResult = await pool.query(
      `SELECT to.*, u.email as customer_email, u.name as customer_name
       FROM traditional_orders to
       LEFT JOIN users u ON to.customer_id = u.id
       WHERE to.id = $1`,
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }
    
    // Get order items
    const itemsResult = await pool.query(
      `SELECT toi.*, ti.name_english, ti.name_telugu, ti.unit
       FROM traditional_order_items toi
       JOIN traditional_items ti ON toi.item_id = ti.id
       WHERE toi.order_id = $1`,
      [id]
    );
    
    res.json({
      success: true,
      data: {
        ...orderResult.rows[0],
        items: itemsResult.rows
      }
    });
    
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order details' 
    });
  }
});

// Get customer orders
app.get('/customer/:customerId/orders', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status, limit = 10, offset = 0 } = req.query;
    
    let query = `
      SELECT * FROM traditional_orders 
      WHERE customer_id = $1
    `;
    const params = [customerId];
    
    if (status) {
      query += ` AND order_status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY order_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// Update order status
app.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      `UPDATE traditional_orders 
       SET order_status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update order status' 
    });
  }
});

// Vendor selection endpoint (internal use)
app.post('/vendor-selection', async (req, res) => {
  try {
    // Forward to Marketplace Management Service
    const response = await axios.post(`${MARKETPLACE_SERVICE_URL}/api/vendor-selection`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error in vendor selection:', error);
    // Fallback to basic vendor selection
    res.json({ vendor_id: 1 }); // Default vendor
  }
});

// Process order endpoint (internal use)
app.post('/process-order', async (req, res) => {
  try {
    // Forward to Order Management Service
    const response = await axios.post(`${ORDER_MANAGEMENT_URL}/api/process-order`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error in order processing:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process order' 
    });
  }
});

// Get translations
app.get('/translations/:lang', async (req, res) => {
  try {
    const { lang } = req.params;
    // Forward to Multi-Language Management Service
    const response = await axios.get(`${MULTI_LANGUAGE_URL}/api/translations/traditional-orders/${lang}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    // Return default translations
    res.json({
      success: true,
      data: {
        title: lang === 'te' ? 'సాంప్రదాయ గృహ సరఫరాలు' : 'Traditional Home Supplies',
        quality_ordinary: lang === 'te' ? 'సాధారణ నాణ్యత' : 'Ordinary Quality',
        quality_medium: lang === 'te' ? 'మధ్యస్థ నాణ్యత' : 'Medium Quality',
        quality_best: lang === 'te' ? 'ఉత్తమ నాణ్యత' : 'Best Quality'
      }
    });
  }
});

// Branch orders endpoint for admin
app.get('/branch/:branchId/orders', async (req, res) => {
  try {
    const { branchId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT to.*, u.email as customer_email, u.name as customer_name
      FROM traditional_orders to
      LEFT JOIN users u ON to.customer_id = u.id
      WHERE to.branch_id = $1
    `;
    const params = [branchId];
    
    if (status) {
      query += ` AND to.order_status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY to.order_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching branch orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// Branch statistics endpoint
app.get('/branch/:branchId/statistics', async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN quality_tier = 'ordinary' THEN 1 END) as ordinary_count,
        COUNT(CASE WHEN quality_tier = 'medium' THEN 1 END) as medium_count,
        COUNT(CASE WHEN quality_tier = 'best' THEN 1 END) as best_count
      FROM traditional_orders
      WHERE branch_id = $1
    `, [branchId]);
    
    const stats = statsResult.rows[0];
    
    res.json({
      success: true,
      data: {
        total_orders: parseInt(stats.total_orders) || 0,
        pending_orders: parseInt(stats.pending_orders) || 0,
        total_revenue: parseFloat(stats.total_revenue) || 0,
        average_order_value: parseFloat(stats.average_order_value) || 0,
        quality_breakdown: {
          ordinary: parseInt(stats.ordinary_count) || 0,
          medium: parseInt(stats.medium_count) || 0,
          best: parseInt(stats.best_count) || 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
});

// Get all orders for super admin
app.get('/all-orders', async (req, res) => {
  try {
    const { status, branch_id, limit = 100, offset = 0 } = req.query;
    
    let query = `
      SELECT to.*, 
        u.email as customer_email, 
        u.name as customer_name,
        b.name as branch_name
      FROM traditional_orders to
      LEFT JOIN users u ON to.customer_id = u.id
      LEFT JOIN branches b ON to.branch_id = b.id
      WHERE 1=1
    `;
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND to.order_status = $${params.length}`;
    }
    
    if (branch_id) {
      params.push(branch_id);
      query += ` AND to.branch_id = $${params.length}`;
    }
    
    query += ` ORDER BY to.order_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// System-wide statistics for super admin
app.get('/system-statistics', async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN order_status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN order_status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as delivered_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(DISTINCT customer_id) as unique_customers,
        COUNT(DISTINCT branch_id) as active_branches
      FROM traditional_orders
    `);
    
    const qualityStats = await pool.query(`
      SELECT quality_tier, COUNT(*) as count, SUM(total_amount) as revenue
      FROM traditional_orders
      GROUP BY quality_tier
    `);
    
    const branchStats = await pool.query(`
      SELECT b.name as branch_name, COUNT(to.*) as order_count, SUM(to.total_amount) as revenue
      FROM branches b
      LEFT JOIN traditional_orders to ON b.id = to.branch_id
      GROUP BY b.id, b.name
      ORDER BY revenue DESC
    `);
    
    const stats = statsResult.rows[0];
    
    res.json({
      success: true,
      data: {
        overview: {
          total_orders: parseInt(stats.total_orders) || 0,
          pending_orders: parseInt(stats.pending_orders) || 0,
          processing_orders: parseInt(stats.processing_orders) || 0,
          shipped_orders: parseInt(stats.shipped_orders) || 0,
          delivered_orders: parseInt(stats.delivered_orders) || 0,
          total_revenue: parseFloat(stats.total_revenue) || 0,
          average_order_value: parseFloat(stats.average_order_value) || 0,
          unique_customers: parseInt(stats.unique_customers) || 0,
          active_branches: parseInt(stats.active_branches) || 0
        },
        quality_breakdown: qualityStats.rows,
        branch_performance: branchStats.rows
      }
    });
    
  } catch (error) {
    console.error('Error fetching system statistics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
});

// Delivery orders endpoint for delivery personnel
app.get('/delivery/orders', async (req, res) => {
  try {
    const { branch_id, status = 'processing,shipped' } = req.query;
    const statusArray = status.split(',');
    
    let query = `
      SELECT to.*, 
        u.email as customer_email, 
        u.name as customer_name,
        u.phone as customer_phone
      FROM traditional_orders to
      LEFT JOIN users u ON to.customer_id = u.id
      WHERE to.order_status = ANY($1::text[])
    `;
    const params = [statusArray];
    
    if (branch_id) {
      query += ` AND to.branch_id = $2`;
      params.push(branch_id);
    }
    
    query += ` ORDER BY 
      CASE 
        WHEN order_status = 'shipped' THEN 1
        WHEN order_status = 'processing' THEN 2
        ELSE 3
      END,
      to.order_date ASC`;
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching delivery orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch delivery orders' 
    });
  }
});

// Vendor management endpoints
app.get('/vendors', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, 
        COUNT(DISTINCT to.id) as total_orders,
        COALESCE(SUM(to.total_amount), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN to.id IS NOT NULL THEN 4.5 END), 0) as rating
      FROM vendors v
      LEFT JOIN traditional_orders to ON v.id = to.selected_vendor_id
      GROUP BY v.id
      ORDER BY v.name
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch vendors' 
    });
  }
});

app.post('/vendors', async (req, res) => {
  try {
    const { name, contact_person, phone, email, address, quality_tiers } = req.body;
    
    const result = await pool.query(
      `INSERT INTO vendors (name, contact_person, phone, email, address, quality_tiers)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, contact_person, phone, email, address, quality_tiers]
    );
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create vendor' 
    });
  }
});

app.put('/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, email, address, quality_tiers } = req.body;
    
    const result = await pool.query(
      `UPDATE vendors 
       SET name = $1, contact_person = $2, phone = $3, email = $4, 
           address = $5, quality_tiers = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, contact_person, phone, email, address, quality_tiers, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update vendor' 
    });
  }
});

app.patch('/vendors/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE vendors 
       SET is_active = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating vendor status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update vendor status' 
    });
  }
});

// Start server
app.listen(port, '127.0.0.1', () => {
  console.log(`🏠 Traditional Orders Service running on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
});