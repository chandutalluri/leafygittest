-- Migration: Create company and branch management tables
-- Order: 3 (after core tables)

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_telugu VARCHAR(255),
  logo_url VARCHAR(500),
  description TEXT,
  description_telugu TEXT,
  registration_number VARCHAR(100),
  gst_number VARCHAR(100),
  fssai_license VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  headquarters_address TEXT,
  headquarters_city VARCHAR(100),
  headquarters_state VARCHAR(100),
  headquarters_pincode VARCHAR(10),
  established_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  business_type VARCHAR(100),
  annual_revenue DECIMAL(15,2),
  employee_count INTEGER,
  social_links JSONB DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) REFERENCES users(id),
  metadata JSONB DEFAULT '{}'
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_telugu VARCHAR(255),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) DEFAULT 'retail',
  manager_id VARCHAR(255) REFERENCES users(id),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  opening_time TIME,
  closing_time TIME,
  working_days JSONB DEFAULT '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]',
  is_warehouse BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  established_date DATE,
  square_feet INTEGER,
  employee_count INTEGER,
  parking_available BOOLEAN DEFAULT true,
  delivery_available BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_branches_company ON branches(company_id);
CREATE INDEX IF NOT EXISTS idx_branches_code ON branches(code);
CREATE INDEX IF NOT EXISTS idx_branches_city ON branches(city);
CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active);