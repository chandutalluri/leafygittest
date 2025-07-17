const { Pool } = require('pg');

async function createTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Create traditional_items table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS traditional_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create branch_traditional_items table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS branch_traditional_items (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL REFERENCES traditional_items(id),
        price_ordinary DECIMAL(10,2),
        price_medium DECIMAL(10,2),
        price_best DECIMAL(10,2),
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(branch_id, item_id)
      )
    `);

    // Insert sample data
    const items = [
      { name: 'Rice', category: 'grains', unit: 'kg', base_price: 60 },
      { name: 'Wheat Flour', category: 'grains', unit: 'kg', base_price: 45 },
      { name: 'Toor Dal', category: 'pulses', unit: 'kg', base_price: 120 },
      { name: 'Chana Dal', category: 'pulses', unit: 'kg', base_price: 90 },
      { name: 'Moong Dal', category: 'pulses', unit: 'kg', base_price: 140 },
      { name: 'Cooking Oil', category: 'oils', unit: 'liter', base_price: 150 },
      { name: 'Salt', category: 'spices', unit: 'kg', base_price: 20 },
      { name: 'Turmeric', category: 'spices', unit: '100g', base_price: 30 },
      { name: 'Red Chili', category: 'spices', unit: '100g', base_price: 40 },
      { name: 'Almonds', category: 'dry_fruits', unit: '250g', base_price: 200 },
    ];

    for (const item of items) {
      await pool.query(
        'INSERT INTO traditional_items (name, category, unit, base_price) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [item.name, item.category, item.unit, item.base_price]
      );
    }

    console.log('✅ Traditional tables created and populated successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createTables();