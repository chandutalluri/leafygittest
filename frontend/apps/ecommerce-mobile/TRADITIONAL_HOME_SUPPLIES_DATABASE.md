# Traditional Home Supplies Mobile Database Architecture

## Mobile Database Connection Overview

The Traditional Home Supplies mobile application connects to the LeafyHealth PostgreSQL database through optimized endpoints designed for mobile performance and offline capabilities.

## Mobile-Optimized Database Queries

### Lightweight Data Retrieval for Mobile
Mobile applications require optimized queries that minimize data transfer and battery usage while maintaining the authentic provisional list experience.

### Essential Mobile Queries

#### 1. Mobile Traditional Items Endpoint
Optimized query for mobile app with compressed data payload.

```sql
-- Mobile-optimized items query
SELECT 
    ti.id,
    ti.name,
    COALESCE(ti.name_telugu, ti.name) as name_telugu,
    ti.category,
    ti.unit,
    bti.ordinary_price,
    bti.medium_price,
    bti.best_price,
    bti.is_available,
    CASE 
        WHEN bti.stock_quantity > 10 THEN 'in_stock'
        WHEN bti.stock_quantity > 0 THEN 'low_stock'
        ELSE 'out_of_stock'
    END as stock_status
FROM traditional_items ti
INNER JOIN branch_traditional_items bti ON ti.id = bti.item_id
WHERE ti.is_available = true 
    AND bti.branch_id = $1
    AND bti.is_available = true
ORDER BY 
    ti.category,
    CASE WHEN bti.stock_quantity > 0 THEN 0 ELSE 1 END,
    ti.name
LIMIT 100; -- Mobile pagination limit
```

#### 2. Mobile Categories with Item Count
Quick category loading for mobile interface.

```sql
-- Mobile categories with essential data only
SELECT 
    tc.id,
    tc.name,
    tc.name_telugu,
    COUNT(ti.id) as item_count,
    tc.display_order
FROM traditional_categories tc
LEFT JOIN traditional_items ti ON tc.name = ti.category
    AND ti.is_available = true
WHERE tc.is_active = true
GROUP BY tc.id, tc.name, tc.name_telugu, tc.display_order
HAVING COUNT(ti.id) > 0
ORDER BY tc.display_order;
```

#### 3. Mobile Order Submission
Optimized transaction for mobile order creation.

```sql
-- Mobile order creation with minimal data
BEGIN;

INSERT INTO traditional_orders (
    customer_id, 
    branch_id, 
    order_number, 
    total_amount, 
    quality_tier, 
    item_count,
    delivery_address,
    device_type
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, 'mobile'
) RETURNING id, order_number;

-- Batch insert order items for efficiency
INSERT INTO traditional_order_items (
    order_id, item_id, quantity, unit_price, total_price, quality_tier
) SELECT 
    $1,
    unnest($2::integer[]),
    unnest($3::decimal[]),
    unnest($4::decimal[]),
    unnest($5::decimal[]),
    $6;

COMMIT;
```

## Mobile-Specific Database Tables

### Mobile App Usage Tracking
```sql
CREATE TABLE mobile_usage_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(100),
    device_info JSONB,
    app_version VARCHAR(20),
    provisional_lists_created INTEGER DEFAULT 0,
    items_selected INTEGER DEFAULT 0,
    session_duration INTEGER, -- in seconds
    offline_mode_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for mobile analytics queries
CREATE INDEX idx_mobile_usage_user_date ON mobile_usage_analytics(user_id, created_at);
```

### Mobile Cache Management
```sql
CREATE TABLE mobile_data_cache (
    id SERIAL PRIMARY KEY,
    cache_key VARCHAR(255) UNIQUE,
    data_type VARCHAR(50), -- 'items', 'categories', 'branch_pricing'
    branch_id INTEGER,
    data_payload JSONB,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accessed_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for cache performance
CREATE INDEX idx_mobile_cache_key ON mobile_data_cache(cache_key);
CREATE INDEX idx_mobile_cache_expiry ON mobile_data_cache(expires_at);
CREATE INDEX idx_mobile_cache_branch ON mobile_data_cache(branch_id);
```

### Mobile Offline Support
```sql
CREATE TABLE mobile_offline_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_id VARCHAR(100),
    offline_order_data JSONB,
    sync_status VARCHAR(20) DEFAULT 'pending', -- pending, synced, failed
    created_offline_at TIMESTAMP,
    synced_at TIMESTAMP,
    error_message TEXT
);

-- Index for offline sync processing
CREATE INDEX idx_mobile_offline_sync ON mobile_offline_orders(sync_status, created_offline_at);
```

## Mobile API Endpoint Database Integration

### Mobile-Specific Data Gateway
The mobile app connects through optimized endpoints that reduce data payload and improve performance.

#### Connection Configuration for Mobile
```javascript
// Mobile-optimized database connection
const mobileDbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'leafyhealth',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    // Mobile-specific optimizations
    max: 10,        // Smaller pool for mobile
    min: 2,         // Minimum connections
    idle: 5000,     // Faster idle timeout
    acquire: 30000, // Mobile timeout
    statement_timeout: 10000, // Quick query timeout
    query_timeout: 8000       // Mobile query timeout
};
```

### Mobile Data Compression
```sql
-- Function to compress mobile data payload
CREATE OR REPLACE FUNCTION get_mobile_traditional_items(
    p_branch_id INTEGER,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    WITH mobile_items AS (
        SELECT 
            jsonb_build_object(
                'id', ti.id,
                'n', ti.name,
                'nt', COALESCE(ti.name_telugu, ti.name),
                'c', ti.category,
                'u', ti.unit,
                'p', jsonb_build_array(
                    bti.ordinary_price,
                    bti.medium_price,
                    bti.best_price
                ),
                'a', bti.is_available,
                's', CASE 
                    WHEN bti.stock_quantity > 10 THEN 2
                    WHEN bti.stock_quantity > 0 THEN 1
                    ELSE 0
                END
            ) as item_data
        FROM traditional_items ti
        INNER JOIN branch_traditional_items bti ON ti.id = bti.item_id
        WHERE ti.is_available = true 
            AND bti.branch_id = p_branch_id
            AND bti.is_available = true
        ORDER BY ti.category, ti.name
        LIMIT p_limit OFFSET p_offset
    )
    SELECT jsonb_agg(item_data) INTO result FROM mobile_items;
    
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;
```

### Mobile Batch Operations
```sql
-- Function for mobile batch order processing
CREATE OR REPLACE FUNCTION process_mobile_provisional_order(
    p_customer_id INTEGER,
    p_branch_id INTEGER,
    p_items JSONB, -- Array of {id, quantity, price}
    p_quality_tier VARCHAR(20),
    p_total_amount DECIMAL(10,2),
    p_device_info JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    new_order_id INTEGER;
    order_number VARCHAR(50);
    item_record RECORD;
    result JSONB;
BEGIN
    -- Generate mobile order number
    order_number := 'MOB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                   LPAD(nextval('mobile_order_sequence')::text, 6, '0');
    
    -- Create main order
    INSERT INTO traditional_orders (
        customer_id, branch_id, order_number, total_amount,
        quality_tier, item_count, device_type
    ) VALUES (
        p_customer_id, p_branch_id, order_number, p_total_amount,
        p_quality_tier, jsonb_array_length(p_items), 'mobile'
    ) RETURNING id INTO new_order_id;
    
    -- Insert order items in batch
    INSERT INTO traditional_order_items (
        order_id, item_id, quantity, unit_price, total_price, quality_tier
    )
    SELECT 
        new_order_id,
        (item->>'id')::integer,
        (item->>'quantity')::decimal,
        (item->>'price')::decimal,
        (item->>'quantity')::decimal * (item->>'price')::decimal,
        p_quality_tier
    FROM jsonb_array_elements(p_items) AS item;
    
    -- Log mobile usage
    INSERT INTO mobile_usage_analytics (
        user_id, device_info, provisional_lists_created, items_selected
    ) VALUES (
        p_customer_id, p_device_info, 1, jsonb_array_length(p_items)
    );
    
    -- Return mobile response
    result := jsonb_build_object(
        'order_id', new_order_id,
        'order_number', order_number,
        'status', 'success',
        'message', 'Provisional list order created successfully'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## Mobile Performance Optimizations

### Database Indexes for Mobile
```sql
-- Mobile-specific performance indexes
CREATE INDEX idx_mobile_traditional_items_branch_category 
ON branch_traditional_items(branch_id, is_available) 
INCLUDE (item_id, ordinary_price, medium_price, best_price);

CREATE INDEX idx_mobile_traditional_items_name_search
ON traditional_items USING gin(to_tsvector('english', name || ' ' || COALESCE(name_telugu, '')));

-- Partial index for mobile active items only
CREATE INDEX idx_mobile_active_items
ON traditional_items(category, name)
WHERE is_available = true;
```

### Mobile Query Optimization
```sql
-- Materialized view for mobile category summary
CREATE MATERIALIZED VIEW mobile_category_summary AS
SELECT 
    tc.id,
    tc.name,
    tc.name_telugu,
    tc.display_order,
    COUNT(ti.id) as item_count,
    AVG(bti.ordinary_price) as avg_price_ordinary,
    AVG(bti.medium_price) as avg_price_medium,
    AVG(bti.best_price) as avg_price_best
FROM traditional_categories tc
LEFT JOIN traditional_items ti ON tc.name = ti.category AND ti.is_available = true
LEFT JOIN branch_traditional_items bti ON ti.id = bti.item_id AND bti.is_available = true
WHERE tc.is_active = true
GROUP BY tc.id, tc.name, tc.name_telugu, tc.display_order;

-- Index on materialized view
CREATE INDEX idx_mobile_category_summary_order ON mobile_category_summary(display_order);

-- Refresh function for mobile data
CREATE OR REPLACE FUNCTION refresh_mobile_data() RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mobile_category_summary;
    
    -- Clean up expired mobile cache
    DELETE FROM mobile_data_cache WHERE expires_at < NOW();
    
    -- Update mobile usage statistics
    UPDATE mobile_usage_analytics 
    SET last_accessed = NOW() 
    WHERE created_at > NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;
```

## Mobile Data Synchronization

### Offline Data Management
```sql
-- Function to prepare offline data package for mobile
CREATE OR REPLACE FUNCTION prepare_mobile_offline_data(
    p_branch_id INTEGER,
    p_user_id INTEGER
) RETURNS JSONB AS $$
DECLARE
    offline_package JSONB;
BEGIN
    WITH offline_data AS (
        SELECT jsonb_build_object(
            'items', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', ti.id,
                        'name', ti.name,
                        'name_telugu', ti.name_telugu,
                        'category', ti.category,
                        'unit', ti.unit,
                        'prices', jsonb_build_object(
                            'ordinary', bti.ordinary_price,
                            'medium', bti.medium_price,
                            'best', bti.best_price
                        ),
                        'available', bti.is_available
                    )
                )
                FROM traditional_items ti
                INNER JOIN branch_traditional_items bti ON ti.id = bti.item_id
                WHERE ti.is_available = true 
                    AND bti.branch_id = p_branch_id
                    AND bti.is_available = true
            ),
            'categories', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', id,
                        'name', name,
                        'name_telugu', name_telugu,
                        'order', display_order
                    )
                )
                FROM traditional_categories
                WHERE is_active = true
            ),
            'branch_info', (
                SELECT jsonb_build_object(
                    'id', id,
                    'name', name,
                    'address', address,
                    'traditional_enabled', (settings->>'traditional_orders')::boolean
                )
                FROM branches
                WHERE id = p_branch_id
            ),
            'sync_timestamp', extract(epoch from now())
        ) as package_data
    )
    SELECT package_data INTO offline_package FROM offline_data;
    
    -- Cache this package for faster retrieval
    INSERT INTO mobile_data_cache (
        cache_key, 
        data_type, 
        branch_id, 
        data_payload, 
        expires_at
    ) VALUES (
        'offline_' || p_branch_id || '_' || p_user_id,
        'offline_package',
        p_branch_id,
        offline_package,
        NOW() + INTERVAL '6 hours'
    ) ON CONFLICT (cache_key) DO UPDATE SET
        data_payload = EXCLUDED.data_payload,
        expires_at = EXCLUDED.expires_at,
        accessed_count = mobile_data_cache.accessed_count + 1,
        last_accessed = NOW();
    
    RETURN offline_package;
END;
$$ LANGUAGE plpgsql;
```

### Mobile Sync Processing
```sql
-- Function to sync offline orders from mobile
CREATE OR REPLACE FUNCTION sync_mobile_offline_orders() RETURNS JSONB AS $$
DECLARE
    sync_result JSONB;
    processed_count INTEGER := 0;
    failed_count INTEGER := 0;
    offline_order RECORD;
BEGIN
    FOR offline_order IN 
        SELECT * FROM mobile_offline_orders 
        WHERE sync_status = 'pending'
        ORDER BY created_offline_at
        LIMIT 100
    LOOP
        BEGIN
            -- Process offline order
            PERFORM process_mobile_provisional_order(
                offline_order.user_id,
                (offline_order.offline_order_data->>'branch_id')::integer,
                offline_order.offline_order_data->'items',
                offline_order.offline_order_data->>'quality_tier',
                (offline_order.offline_order_data->>'total_amount')::decimal,
                offline_order.offline_order_data->'device_info'
            );
            
            -- Mark as synced
            UPDATE mobile_offline_orders 
            SET sync_status = 'synced', synced_at = NOW()
            WHERE id = offline_order.id;
            
            processed_count := processed_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            -- Mark as failed
            UPDATE mobile_offline_orders 
            SET sync_status = 'failed', error_message = SQLERRM
            WHERE id = offline_order.id;
            
            failed_count := failed_count + 1;
        END;
    END LOOP;
    
    sync_result := jsonb_build_object(
        'processed', processed_count,
        'failed', failed_count,
        'timestamp', extract(epoch from now())
    );
    
    RETURN sync_result;
END;
$$ LANGUAGE plpgsql;
```

## Mobile Database Monitoring

### Mobile Performance Metrics
```sql
-- View for mobile database performance
CREATE VIEW mobile_db_performance AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    AVG(session_duration) as avg_session_duration,
    COUNT(*) FILTER (WHERE offline_mode_used = true) as offline_sessions,
    AVG(items_selected) as avg_items_per_session,
    COUNT(DISTINCT user_id) as unique_users
FROM mobile_usage_analytics
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

This mobile database architecture ensures optimal performance for the Traditional Home Supplies provisional list concept while maintaining data integrity and supporting offline capabilities essential for mobile users.