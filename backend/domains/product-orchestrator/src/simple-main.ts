import * as express from 'express';
import * as cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3042;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'product-orchestrator',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    service: 'Product Orchestrator Service',
    version: '1.0.0',
    description: 'Orchestrates product creation across multiple services',
    endpoints: [
      { method: 'GET', path: '/health', description: 'Health check' },
      { method: 'POST', path: '/products/create', description: 'Create product with all related data' },
      { method: 'PUT', path: '/products/:id/update', description: 'Update product across services' },
      { method: 'POST', path: '/products/:id/images', description: 'Add images to product' },
      { method: 'POST', path: '/products/:id/inventory', description: 'Set inventory levels' },
      { method: 'POST', path: '/products/bulk-import', description: 'Import multiple products' }
    ]
  });
});

// Create product with orchestration
app.post('/products/create', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      name,
      nameTelugu,
      description,
      descriptionTelugu,
      sku,
      categoryId,
      sellingPrice,
      mrp,
      unit,
      images,
      branches,
      tags
    } = req.body;
    
    // Validate required fields
    if (!name || !sku || !categoryId || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, sku, categoryId, sellingPrice'
      });
    }
    
    await client.query('BEGIN');
    
    // 1. Create product in products table
    const productResult = await client.query(`
      INSERT INTO products (
        name, name_telugu, description, description_telugu,
        sku, category_id, selling_price, mrp, unit,
        is_featured, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, true)
      RETURNING *
    `, [
      name, nameTelugu || name, description || '', descriptionTelugu || description || '',
      sku, categoryId, sellingPrice, mrp || sellingPrice, unit || 'piece'
    ]);
    
    const product = productResult.rows[0];
    
    // 2. Add product tags if provided
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await client.query(
          'INSERT INTO product_tags (product_id, tag_name) VALUES ($1, $2)',
          [product.id, tag]
        );
      }
    }
    
    // 3. Create inventory entries for each branch
    if (branches && branches.length > 0) {
      for (const branch of branches) {
        await client.query(`
          INSERT INTO inventory (
            product_id, branch_id, quantity, reorder_level,
            reorder_quantity, last_restocked
          ) VALUES ($1, $2, $3, $4, $5, NOW())
        `, [
          product.id,
          branch.branchId,
          branch.initialStock || 0,
          branch.reorderLevel || 10,
          branch.reorderQuantity || 50
        ]);
      }
    }
    
    // 4. Add images if provided
    if (images && images.length > 0) {
      const imageUrl = images[0]; // Use first image as primary
      await client.query(
        'UPDATE products SET image_url = $1 WHERE id = $2',
        [imageUrl, product.id]
      );
      
      // Store additional images in images table
      for (const imageUrl of images) {
        await client.query(`
          INSERT INTO images (
            url, entity_type, entity_id, 
            original_name, mime_type, size
          ) VALUES ($1, 'product', $2, $3, 'image/jpeg', 0)
        `, [imageUrl, product.id, imageUrl.split('/').pop()]);
      }
    }
    
    await client.query('COMMIT');
    
    // Fetch complete product data
    const completeProduct = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.name_telugu as category_name_telugu,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'branch_id', i.branch_id,
              'quantity', i.quantity,
              'reorder_level', i.reorder_level
            )
          ) FILTER (WHERE i.branch_id IS NOT NULL), 
          '[]'
        ) as inventory,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', img.id,
              'url', img.url
            )
          ) FILTER (WHERE img.id IS NOT NULL), 
          '[]'
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      LEFT JOIN images img ON p.id = img.entity_id AND img.entity_type = 'product'
      WHERE p.id = $1
      GROUP BY p.id, c.name, c.name_telugu
    `, [product.id]);
    
    res.json({
      success: true,
      message: 'Product created successfully',
      data: completeProduct.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  } finally {
    client.release();
  }
});

// Update product across services
app.put('/products/:id/update', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await client.query('BEGIN');
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    const allowedFields = [
      'name', 'name_telugu', 'description', 'description_telugu',
      'selling_price', 'mrp', 'unit', 'is_featured', 'is_available'
    ];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }
    
    if (updateFields.length > 0) {
      values.push(id);
      const updateQuery = `
        UPDATE products 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await client.query(updateQuery, values);
      
      if (result.rows.length === 0) {
        throw new Error('Product not found');
      }
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: result.rows[0]
      });
    } else {
      throw new Error('No valid fields to update');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Product update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product'
    });
  } finally {
    client.release();
  }
});

// Add images to product
app.post('/products/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;
    
    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }
    
    const addedImages = [];
    
    for (const imageUrl of images) {
      const result = await pool.query(`
        INSERT INTO images (
          url, entity_type, entity_id, 
          original_name, mime_type, size
        ) VALUES ($1, 'product', $2, $3, 'image/jpeg', 0)
        RETURNING *
      `, [imageUrl, id, imageUrl.split('/').pop()]);
      
      addedImages.push(result.rows[0]);
    }
    
    // Update primary image if product doesn't have one
    const productCheck = await pool.query(
      'SELECT image_url FROM products WHERE id = $1',
      [id]
    );
    
    if (productCheck.rows.length > 0 && !productCheck.rows[0].image_url) {
      await pool.query(
        'UPDATE products SET image_url = $1 WHERE id = $2',
        [images[0], id]
      );
    }
    
    res.json({
      success: true,
      message: `${addedImages.length} images added successfully`,
      data: addedImages
    });
  } catch (error) {
    console.error('Add images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add images'
    });
  }
});

// Set inventory levels
app.post('/products/:id/inventory', async (req, res) => {
  try {
    const { id } = req.params;
    const { branches } = req.body;
    
    if (!branches || branches.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No branch inventory data provided'
      });
    }
    
    const inventoryUpdates = [];
    
    for (const branch of branches) {
      // Check if inventory entry exists
      const existing = await pool.query(
        'SELECT id FROM inventory WHERE product_id = $1 AND branch_id = $2',
        [id, branch.branchId]
      );
      
      if (existing.rows.length > 0) {
        // Update existing
        const result = await pool.query(`
          UPDATE inventory 
          SET quantity = $1, reorder_level = $2, reorder_quantity = $3, updated_at = NOW()
          WHERE product_id = $4 AND branch_id = $5
          RETURNING *
        `, [
          branch.quantity || 0,
          branch.reorderLevel || 10,
          branch.reorderQuantity || 50,
          id,
          branch.branchId
        ]);
        inventoryUpdates.push(result.rows[0]);
      } else {
        // Create new
        const result = await pool.query(`
          INSERT INTO inventory (
            product_id, branch_id, quantity, reorder_level,
            reorder_quantity, last_restocked
          ) VALUES ($1, $2, $3, $4, $5, NOW())
          RETURNING *
        `, [
          id,
          branch.branchId,
          branch.quantity || 0,
          branch.reorderLevel || 10,
          branch.reorderQuantity || 50
        ]);
        inventoryUpdates.push(result.rows[0]);
      }
    }
    
    res.json({
      success: true,
      message: 'Inventory levels updated successfully',
      data: inventoryUpdates
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory'
    });
  }
});

// Bulk import products
app.post('/products/bulk-import', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { products } = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products provided for import'
      });
    }
    
    await client.query('BEGIN');
    
    const importedProducts = [];
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const productData of products) {
      try {
        // Create each product
        const result = await client.query(`
          INSERT INTO products (
            name, name_telugu, description, description_telugu,
            sku, category_id, selling_price, mrp, unit,
            is_featured, is_available
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, true)
          RETURNING id, name, sku
        `, [
          productData.name,
          productData.nameTelugu || productData.name,
          productData.description || '',
          productData.descriptionTelugu || productData.description || '',
          productData.sku,
          productData.categoryId,
          productData.sellingPrice,
          productData.mrp || productData.sellingPrice,
          productData.unit || 'piece'
        ]);
        
        importedProducts.push(result.rows[0]);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          sku: productData.sku,
          name: productData.name,
          error: error.message
        });
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: `Bulk import completed. Success: ${successCount}, Failed: ${errorCount}`,
      data: {
        imported: importedProducts,
        errors: errors,
        summary: {
          total: products.length,
          success: successCount,
          failed: errorCount
        }
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import products'
    });
  } finally {
    client.release();
  }
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🎯 Product Orchestrator Service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
});