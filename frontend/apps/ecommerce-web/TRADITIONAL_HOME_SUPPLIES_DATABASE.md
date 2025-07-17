# Traditional Home Supplies Database Architecture

## Database Connection Overview

The Traditional Home Supplies system integrates with the LeafyHealth PostgreSQL database through multiple connection points to maintain the authentic provisional list concept.

## Database Tables Structure

### Core Traditional Items Tables

#### 1. traditional_items
Primary table storing all traditional household items with Telugu translations.

```sql
CREATE TABLE traditional_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_telugu VARCHAR(255),
    category VARCHAR(100),
    unit VARCHAR(50),
    base_price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    description TEXT,
    nutritional_info JSONB,
    storage_instructions TEXT,
    origin_region VARCHAR(100),
    organic_certified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO traditional_items (name, name_telugu, category, unit, base_price) VALUES
('Basmati Rice', 'బాస్మతి అన్నం', 'Grains', 'kg', 120.00),
('Toor Dal', 'కందిపప్పు', 'Pulses', 'kg', 85.00),
('Turmeric Powder', 'పసుపుపొడి', 'Spices', 'g', 0.45),
('Coconut Oil', 'కొబ్బరనూనె', 'Oils', 'l', 180.00),
('Jaggery', 'బెల్లం', 'Sweeteners', 'kg', 95.00);
```

#### 2. branch_traditional_items
Branch-specific pricing and availability for the three quality tiers.

```sql
CREATE TABLE branch_traditional_items (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES traditional_items(id) ON DELETE CASCADE,
    ordinary_price DECIMAL(10,2) NOT NULL,
    medium_price DECIMAL(10,2) NOT NULL,
    best_price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(branch_id, item_id)
);

-- Sample branch pricing data
INSERT INTO branch_traditional_items (branch_id, item_id, ordinary_price, medium_price, best_price) VALUES
(1, 1, 110.00, 120.00, 135.00), -- Basmati Rice at Branch 1
(1, 2, 80.00, 85.00, 95.00),    -- Toor Dal at Branch 1
(2, 1, 115.00, 125.00, 140.00), -- Basmati Rice at Branch 2
(2, 2, 82.00, 87.00, 97.00);    -- Toor Dal at Branch 2
```

#### 3. traditional_categories
Categories for organizing traditional items with Telugu translations.

```sql
CREATE TABLE traditional_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_telugu VARCHAR(100),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Category data
INSERT INTO traditional_categories (name, name_telugu, display_order) VALUES
('Grains', 'ధాన్యాలు', 1),
('Pulses', 'పప్పుధాన్యాలు', 2),
('Spices', 'మసాలాలు', 3),
('Oils', 'నూనెలు', 4),
('Sweeteners', 'తీపిపదార్థాలు', 5),
('Vegetables', 'కూరగాయలు', 6);
```

### Order Management Tables

#### 4. traditional_orders
Stores provisional list orders as complete units.

```sql
CREATE TABLE traditional_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    branch_id INTEGER REFERENCES branches(id),
    order_number VARCHAR(50) UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL,
    quality_tier VARCHAR(20) NOT NULL CHECK (quality_tier IN ('ordinary', 'medium', 'best')),
    item_count INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT,
    special_instructions TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_traditional_orders_customer ON traditional_orders(customer_id);
CREATE INDEX idx_traditional_orders_branch ON traditional_orders(branch_id);
CREATE INDEX idx_traditional_orders_status ON traditional_orders(status);
```

#### 5. traditional_order_items
Individual items within each provisional list order.

```sql
CREATE TABLE traditional_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES traditional_orders(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES traditional_items(id),
    quantity DECIMAL(8,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    quality_tier VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient order item retrieval
CREATE INDEX idx_traditional_order_items_order ON traditional_order_items(order_id);
```

### Integration Tables

#### 6. traditional_vendors
Vendor information for traditional items sourcing.

```sql
CREATE TABLE traditional_vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_telugu VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    specialties TEXT[],
    quality_rating DECIMAL(3,2),
    is_certified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. traditional_item_vendors
Many-to-many relationship between items and vendors.

```sql
CREATE TABLE traditional_item_vendors (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES traditional_items(id),
    vendor_id INTEGER REFERENCES traditional_vendors(id),
    supply_price DECIMAL(10,2),
    minimum_order_quantity INTEGER,
    lead_time_days INTEGER,
    is_preferred BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, vendor_id)
);
```

## Database Connection Configuration

### Connection Details
- **Host**: localhost (local PostgreSQL instance)
- **Port**: 5432
- **Database**: LeafyHealth platform database
- **Connection Method**: Pool-based connections for optimal performance

### Environment Variables
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/leafyhealth
PGHOST=localhost
PGPORT=5432
PGDATABASE=leafyhealth
PGUSER=username
PGPASSWORD=password
```

### Connection Pool Settings
```javascript
const poolConfig = {
  host: 'localhost',
  port: 5432,
  database: 'leafyhealth',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 20,        // Maximum pool size
  min: 5,         // Minimum pool size
  idle: 10000,    // Idle timeout
  acquire: 60000, // Acquire timeout
  evict: 1000     // Eviction interval
};
```

## API Endpoints Database Queries

### GET /api/traditional/items
Retrieves all traditional items with branch-specific pricing.

```sql
SELECT 
    ti.id,
    ti.name,
    ti.name_telugu,
    ti.category,
    ti.unit,
    ti.is_available,
    bti.ordinary_price,
    bti.medium_price,
    bti.best_price,
    bti.stock_quantity
FROM traditional_items ti
LEFT JOIN branch_traditional_items bti ON ti.id = bti.item_id
WHERE ti.is_available = true 
    AND bti.branch_id = $1
    AND bti.is_available = true
ORDER BY ti.category, ti.name;
```

### GET /api/traditional/categories
Retrieves all active categories with item counts.

```sql
SELECT 
    tc.id,
    tc.name,
    tc.name_telugu,
    tc.display_order,
    COUNT(ti.id) as item_count
FROM traditional_categories tc
LEFT JOIN traditional_items ti ON tc.name = ti.category
WHERE tc.is_active = true
GROUP BY tc.id, tc.name, tc.name_telugu, tc.display_order
ORDER BY tc.display_order;
```

### POST /api/traditional/orders
Creates a new provisional list order.

```sql
-- Insert main order
INSERT INTO traditional_orders (
    customer_id, branch_id, order_number, total_amount, 
    quality_tier, item_count, delivery_address
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING id;

-- Insert order items
INSERT INTO traditional_order_items (
    order_id, item_id, quantity, unit_price, total_price, quality_tier
) VALUES ($1, $2, $3, $4, $5, $6);
```

## Branch-Specific Data Handling

### Branch Settings for Traditional Orders
```sql
-- Enable/disable traditional orders per branch
UPDATE branches 
SET settings = jsonb_set(
    COALESCE(settings, '{}'),
    '{traditional_orders}',
    'true'
) 
WHERE id = $1;

-- Check if branch supports traditional orders
SELECT settings->'traditional_orders' as traditional_enabled
FROM branches 
WHERE id = $1;
```

### Quality Tier Pricing Logic
```sql
-- Get price based on quality tier
SELECT 
    CASE 
        WHEN $2 = 'ordinary' THEN ordinary_price
        WHEN $2 = 'medium' THEN medium_price
        WHEN $2 = 'best' THEN best_price
        ELSE ordinary_price
    END as price
FROM branch_traditional_items
WHERE branch_id = $1 AND item_id = $3;
```

## Data Integrity and Constraints

### Primary Constraints
1. **Unique Branch-Item Combinations**: Each item can only have one pricing record per branch
2. **Quality Tier Validation**: Only 'ordinary', 'medium', 'best' values allowed
3. **Positive Pricing**: All prices must be greater than 0
4. **Branch Reference Integrity**: All items must belong to valid branches

### Database Triggers
```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_traditional_items_updated_at 
    BEFORE UPDATE ON traditional_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traditional_orders_updated_at 
    BEFORE UPDATE ON traditional_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Data Validation Rules
```sql
-- Ensure positive quantities and prices
ALTER TABLE traditional_order_items 
ADD CONSTRAINT check_positive_quantity 
CHECK (quantity > 0);

ALTER TABLE traditional_order_items 
ADD CONSTRAINT check_positive_prices 
CHECK (unit_price > 0 AND total_price > 0);

-- Ensure valid quality tiers
ALTER TABLE traditional_orders 
ADD CONSTRAINT check_quality_tier 
CHECK (quality_tier IN ('ordinary', 'medium', 'best'));
```

## Performance Optimization

### Essential Indexes
```sql
-- Performance indexes for traditional items
CREATE INDEX idx_traditional_items_category ON traditional_items(category);
CREATE INDEX idx_traditional_items_available ON traditional_items(is_available);
CREATE INDEX idx_branch_traditional_items_branch ON branch_traditional_items(branch_id);
CREATE INDEX idx_branch_traditional_items_available ON branch_traditional_items(is_available);

-- Composite indexes for common queries
CREATE INDEX idx_traditional_items_category_available 
ON traditional_items(category, is_available);

CREATE INDEX idx_branch_items_branch_available 
ON branch_traditional_items(branch_id, is_available);
```

### Query Optimization Tips
1. **Use Prepared Statements**: Reduce parsing overhead for repeated queries
2. **Limit Result Sets**: Always use appropriate LIMIT clauses
3. **Index Branch Queries**: Branch-specific queries are very common
4. **Cache Category Data**: Categories change infrequently, perfect for caching

## Data Migration Considerations

### Adding New Traditional Items
```sql
-- Stored procedure for adding new traditional items across all branches
CREATE OR REPLACE FUNCTION add_traditional_item_to_all_branches(
    p_name VARCHAR,
    p_name_telugu VARCHAR,
    p_category VARCHAR,
    p_unit VARCHAR,
    p_base_price DECIMAL
) RETURNS INTEGER AS $$
DECLARE
    new_item_id INTEGER;
    branch_record RECORD;
BEGIN
    -- Insert new item
    INSERT INTO traditional_items (name, name_telugu, category, unit, base_price)
    VALUES (p_name, p_name_telugu, p_category, p_unit, p_base_price)
    RETURNING id INTO new_item_id;
    
    -- Add pricing for all active branches
    FOR branch_record IN SELECT id FROM branches WHERE is_active = true LOOP
        INSERT INTO branch_traditional_items (
            branch_id, item_id, ordinary_price, medium_price, best_price
        ) VALUES (
            branch_record.id,
            new_item_id,
            p_base_price * 0.9,  -- 10% discount for ordinary
            p_base_price,        -- Base price for medium
            p_base_price * 1.15  -- 15% premium for best
        );
    END LOOP;
    
    RETURN new_item_id;
END;
$$ LANGUAGE plpgsql;
```

## Backup and Recovery

### Critical Data Protection
```sql
-- Daily backup of traditional items data
pg_dump -t traditional_items -t branch_traditional_items -t traditional_categories \
        -t traditional_orders -t traditional_order_items \
        leafyhealth > traditional_backup_$(date +%Y%m%d).sql
```

This database architecture ensures the Traditional Home Supplies provisional list concept maintains data integrity while providing optimal performance for the authentic Indian household shopping experience.