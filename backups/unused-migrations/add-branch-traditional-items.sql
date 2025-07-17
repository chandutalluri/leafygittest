-- Create branch_traditional_items table for branch-specific pricing and availability
CREATE TABLE IF NOT EXISTS branch_traditional_items (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES traditional_items(id) ON DELETE CASCADE,
  ordinary_price DECIMAL(10, 2) NOT NULL,
  medium_price DECIMAL(10, 2) NOT NULL,
  best_price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, item_id)
);

-- Create index for faster queries
CREATE INDEX idx_branch_traditional_items_branch ON branch_traditional_items(branch_id);
CREATE INDEX idx_branch_traditional_items_available ON branch_traditional_items(is_available);

-- Update branches table to add traditional orders service toggle in settings
-- This uses the existing settings JSONB column
UPDATE branches 
SET settings = COALESCE(settings, '{}'::jsonb) || '{"services": {"traditional_orders": true}}'::jsonb
WHERE settings IS NULL OR settings::text = '{}';

-- Insert sample branch-specific pricing for existing branches and items
-- Prices vary by branch location (city-based pricing strategy)
INSERT INTO branch_traditional_items (branch_id, item_id, ordinary_price, medium_price, best_price, stock_quantity, is_available)
SELECT 
  b.id as branch_id,
  ti.id as item_id,
  -- Base prices with branch-specific adjustments
  CASE 
    WHEN b.city = 'Hyderabad' THEN ti.base_price * 1.1  -- 10% higher in Hyderabad
    WHEN b.city = 'Visakhapatnam' THEN ti.base_price * 0.95  -- 5% lower in Vizag
    ELSE ti.base_price  -- Standard price in other cities
  END as ordinary_price,
  CASE 
    WHEN b.city = 'Hyderabad' THEN ti.base_price * 1.3  -- Premium pricing in metro
    WHEN b.city = 'Visakhapatnam' THEN ti.base_price * 1.15
    ELSE ti.base_price * 1.2
  END as medium_price,
  CASE 
    WHEN b.city = 'Hyderabad' THEN ti.base_price * 1.6  -- Highest premium in metro
    WHEN b.city = 'Visakhapatnam' THEN ti.base_price * 1.4
    ELSE ti.base_price * 1.5
  END as best_price,
  -- Random stock quantities for demo
  FLOOR(RANDOM() * 500 + 100)::INTEGER as stock_quantity,
  -- Make some items unavailable at random branches (90% availability)
  RANDOM() > 0.1 as is_available
FROM branches b
CROSS JOIN traditional_items ti
WHERE b.is_active = true
ON CONFLICT (branch_id, item_id) DO NOTHING;

-- Update some branches to NOT offer traditional orders service (for testing)
UPDATE branches 
SET settings = jsonb_set(settings, '{services,traditional_orders}', 'false'::jsonb)
WHERE id IN (
  SELECT id FROM branches 
  WHERE city = 'Vijayawada' 
  LIMIT 1
);