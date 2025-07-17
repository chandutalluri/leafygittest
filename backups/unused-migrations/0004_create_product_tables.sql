-- Migration: Create product catalog tables
-- Order: 4 (after company tables)

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_telugu VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_telugu TEXT,
  parent_id INTEGER REFERENCES categories(id),
  image_url VARCHAR(500),
  icon VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_telugu VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  description TEXT,
  description_telugu TEXT,
  category_id INTEGER REFERENCES categories(id),
  brand VARCHAR(255),
  unit VARCHAR(50) NOT NULL,
  unit_telugu VARCHAR(50),
  size VARCHAR(50),
  weight DECIMAL(10,3),
  selling_price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  tax_percentage DECIMAL(5,2) DEFAULT 0,
  hsn_code VARCHAR(20),
  image_url VARCHAR(500),
  gallery_images JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_organic BOOLEAN DEFAULT true,
  is_perishable BOOLEAN DEFAULT false,
  shelf_life_days INTEGER,
  storage_instructions TEXT,
  storage_instructions_telugu TEXT,
  nutritional_info JSONB DEFAULT '{}',
  ingredients TEXT,
  ingredients_telugu TEXT,
  allergen_info TEXT,
  allergen_info_telugu TEXT,
  country_of_origin VARCHAR(100) DEFAULT 'India',
  manufacturer VARCHAR(255),
  manufacturer_address TEXT,
  tags JSONB DEFAULT '[]',
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) REFERENCES users(id)
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  weight DECIMAL(10,3),
  selling_price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);