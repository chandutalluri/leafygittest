-- Migration: Create all remaining tables for complete 77-table architecture
-- Order: 5 (after product tables)

-- Inventory tables
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
  current_stock INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 10,
  maximum_stock INTEGER DEFAULT 1000,
  reorder_point INTEGER DEFAULT 20,
  reorder_quantity INTEGER DEFAULT 50,
  last_restock_date TIMESTAMP,
  last_stock_check TIMESTAMP,
  stock_value DECIMAL(10,2),
  location_in_store VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, branch_id)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id SERIAL PRIMARY KEY,
  inventory_id INTEGER REFERENCES inventory(id),
  transaction_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2),
  total_value DECIMAL(10,2),
  reference_type VARCHAR(50),
  reference_id VARCHAR(100),
  notes TEXT,
  performed_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  gst_number VARCHAR(50),
  payment_terms VARCHAR(100),
  delivery_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  branch_id INTEGER REFERENCES branches(id),
  order_date DATE NOT NULL,
  expected_delivery DATE,
  status VARCHAR(50) DEFAULT 'draft',
  total_amount DECIMAL(12,2),
  tax_amount DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  net_amount DECIMAL(12,2),
  payment_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_by VARCHAR(255) REFERENCES users(id),
  approved_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id SERIAL PRIMARY KEY,
  purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_percentage DECIMAL(5,2),
  discount_percentage DECIMAL(5,2),
  total_amount DECIMAL(10,2),
  received_quantity INTEGER DEFAULT 0,
  notes TEXT
);

-- Customer tables
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  customer_code VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  alternate_phone VARCHAR(20),
  date_of_birth DATE,
  anniversary_date DATE,
  preferred_language VARCHAR(10) DEFAULT 'te',
  loyalty_points INTEGER DEFAULT 0,
  lifetime_value DECIMAL(12,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  last_order_date TIMESTAMP,
  preferred_payment_method VARCHAR(50),
  tags JSONB DEFAULT '[]',
  notes TEXT,
  referral_code VARCHAR(50) UNIQUE,
  referred_by INTEGER REFERENCES customers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'home',
  name VARCHAR(255),
  phone VARCHAR(20),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  landmark VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, product_id)
);

-- Shopping cart tables
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  session_id VARCHAR(255),
  branch_id INTEGER REFERENCES branches(id),
  status VARCHAR(50) DEFAULT 'active',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order tables
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  branch_id INTEGER REFERENCES branches(id),
  order_type VARCHAR(50) DEFAULT 'online',
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  delivery_address_id INTEGER REFERENCES customer_addresses(id),
  delivery_date DATE,
  delivery_time_slot VARCHAR(50),
  notes TEXT,
  customer_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment tables
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending',
  gateway VARCHAR(50),
  gateway_response JSONB,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  details JSONB,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refunds (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  payment_id INTEGER REFERENCES payments(id),
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  processed_at TIMESTAMP,
  processed_by VARCHAR(255) REFERENCES users(id),
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial tables
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  vendor_name VARCHAR(255),
  receipt_number VARCHAR(100),
  receipt_url VARCHAR(500),
  expense_date DATE NOT NULL,
  approved_by VARCHAR(255) REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cash_registers (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id),
  opening_balance DECIMAL(10,2) NOT NULL,
  closing_balance DECIMAL(10,2),
  cash_sales DECIMAL(10,2) DEFAULT 0,
  cash_refunds DECIMAL(10,2) DEFAULT 0,
  cash_expenses DECIMAL(10,2) DEFAULT 0,
  expected_balance DECIMAL(10,2),
  variance DECIMAL(10,2),
  opened_by VARCHAR(255) REFERENCES users(id),
  closed_by VARCHAR(255) REFERENCES users(id),
  opened_at TIMESTAMP NOT NULL,
  closed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'open',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS accounting_entries (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id),
  entry_date DATE NOT NULL,
  account_type VARCHAR(50) NOT NULL,
  debit_amount DECIMAL(12,2) DEFAULT 0,
  credit_amount DECIMAL(12,2) DEFAULT 0,
  description TEXT,
  reference_type VARCHAR(50),
  reference_id VARCHAR(100),
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping tables
CREATE TABLE IF NOT EXISTS shipping_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  base_charge DECIMAL(10,2) NOT NULL,
  per_kg_charge DECIMAL(10,2) DEFAULT 0,
  per_km_charge DECIMAL(10,2) DEFAULT 0,
  free_delivery_above DECIMAL(10,2),
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  is_active BOOLEAN DEFAULT true,
  zones JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_routes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  branch_id INTEGER REFERENCES branches(id),
  areas JSONB NOT NULL,
  delivery_person_id VARCHAR(255) REFERENCES users(id),
  vehicle_number VARCHAR(50),
  capacity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  delivery_route_id INTEGER REFERENCES delivery_routes(id),
  delivery_person_id VARCHAR(255) REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'assigned',
  pickup_time TIMESTAMP,
  delivery_time TIMESTAMP,
  customer_rating INTEGER,
  customer_feedback TEXT,
  proof_of_delivery VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketing tables
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  value_type VARCHAR(50) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_purchase DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  customer_usage_limit INTEGER DEFAULT 1,
  applicable_products JSONB DEFAULT '[]',
  applicable_categories JSONB DEFAULT '[]',
  applicable_branches JSONB DEFAULT '[]',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  terms_conditions TEXT,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotion_usage (
  id SERIAL PRIMARY KEY,
  promotion_id INTEGER REFERENCES promotions(id),
  customer_id INTEGER REFERENCES customers(id),
  order_id INTEGER REFERENCES orders(id),
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty_programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  points_per_rupee DECIMAL(5,2) DEFAULT 1,
  rupee_per_point DECIMAL(5,2) DEFAULT 0.1,
  minimum_points_redeem INTEGER DEFAULT 100,
  maximum_points_redeem INTEGER,
  is_active BOOLEAN DEFAULT true,
  terms_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  transaction_type VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  balance_points INTEGER NOT NULL,
  reference_type VARCHAR(50),
  reference_id VARCHAR(100),
  notes TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Review tables
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  customer_id INTEGER REFERENCES customers(id),
  order_id INTEGER REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'pending',
  moderated_by VARCHAR(255) REFERENCES users(id),
  moderated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review_responses (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  responded_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee tables
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  branch_id INTEGER REFERENCES branches(id),
  department VARCHAR(100),
  designation VARCHAR(100),
  joining_date DATE NOT NULL,
  salary DECIMAL(10,2),
  bank_account_number VARCHAR(50),
  bank_name VARCHAR(255),
  ifsc_code VARCHAR(20),
  pan_number VARCHAR(20),
  aadhar_number VARCHAR(20),
  emergency_contact VARCHAR(20),
  blood_group VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  left_date DATE,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  date DATE NOT NULL,
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'present',
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS employee_leaves (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  leave_type VARCHAR(50) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by VARCHAR(255) REFERENCES users(id),
  approved_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor tables
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  vendor_type VARCHAR(100),
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  gst_number VARCHAR(50),
  pan_number VARCHAR(20),
  bank_details JSONB,
  payment_terms VARCHAR(100),
  credit_limit DECIMAL(12,2),
  current_balance DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendor_transactions (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance DECIMAL(12,2) NOT NULL,
  reference_type VARCHAR(50),
  reference_id VARCHAR(100),
  payment_method VARCHAR(50),
  payment_date DATE,
  notes TEXT,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification tables
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sms_logs (
  id SERIAL PRIMARY KEY,
  to_phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  delivery_status VARCHAR(50),
  error_message TEXT,
  provider VARCHAR(50),
  cost DECIMAL(5,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS push_notification_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  device_token VARCHAR(500),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  platform VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics tables
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  page_url TEXT,
  referrer_url TEXT,
  properties JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_statistics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  branch_id INTEGER REFERENCES branches(id),
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  total_items_sold INTEGER DEFAULT 0,
  top_selling_products JSONB DEFAULT '[]',
  payment_method_breakdown JSONB DEFAULT '{}',
  hourly_sales JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, branch_id)
);

CREATE TABLE IF NOT EXISTS product_statistics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  add_to_cart INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  quantity_sold INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, date)
);

-- System tables
CREATE TABLE IF NOT EXISTS api_performance_logs (
  id SERIAL PRIMARY KEY,
  endpoint VARCHAR(500) NOT NULL,
  method VARCHAR(10) NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  user_id VARCHAR(255),
  ip_address INET,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS database_performance_logs (
  id SERIAL PRIMARY KEY,
  query_hash VARCHAR(64),
  query_text TEXT,
  execution_time_ms INTEGER,
  rows_affected INTEGER,
  service_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by VARCHAR(255) REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(100),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription tables
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  delivery_frequency_days INTEGER,
  products JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_subscriptions (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  plan_id INTEGER REFERENCES subscription_plans(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  next_delivery_date DATE,
  delivery_address_id INTEGER REFERENCES customer_addresses(id),
  payment_method_id INTEGER REFERENCES payment_methods(id),
  auto_renew BOOLEAN DEFAULT true,
  cancelled_at TIMESTAMP,
  cancelled_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscription_deliveries (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES customer_subscriptions(id),
  order_id INTEGER REFERENCES orders(id),
  scheduled_date DATE NOT NULL,
  delivered_date DATE,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content management tables
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_by VARCHAR(255) REFERENCES users(id),
  updated_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  position VARCHAR(50) DEFAULT 'home',
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration tables
CREATE TABLE IF NOT EXISTS webhooks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  events JSONB NOT NULL,
  headers JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  webhook_id INTEGER REFERENCES webhooks(id),
  event VARCHAR(100) NOT NULL,
  payload JSONB,
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_integrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  config JSONB NOT NULL,
  credentials JSONB,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integration_logs (
  id SERIAL PRIMARY KEY,
  integration_id INTEGER REFERENCES api_integrations(id),
  action VARCHAR(100) NOT NULL,
  status VARCHAR(50),
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Label design tables
CREATE TABLE IF NOT EXISTS label_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  layout JSONB NOT NULL,
  size_width DECIMAL(10,2),
  size_height DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS custom_template_dimensions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  paper_size VARCHAR(50) NOT NULL,
  paper_width DECIMAL(10,2) NOT NULL,
  paper_height DECIMAL(10,2) NOT NULL,
  margin_top DECIMAL(10,2) DEFAULT 0,
  margin_right DECIMAL(10,2) DEFAULT 0,
  margin_bottom DECIMAL(10,2) DEFAULT 0,
  margin_left DECIMAL(10,2) DEFAULT 0,
  label_width DECIMAL(10,2) NOT NULL,
  label_height DECIMAL(10,2) NOT NULL,
  horizontal_gap DECIMAL(10,2) DEFAULT 0,
  vertical_gap DECIMAL(10,2) DEFAULT 0,
  horizontal_count INTEGER DEFAULT 1,
  vertical_count INTEGER DEFAULT 1,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS print_jobs (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES label_templates(id),
  product_ids JSONB NOT NULL,
  quantity INTEGER NOT NULL,
  printer_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  created_by VARCHAR(255) REFERENCES users(id),
  printed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace tables
CREATE TABLE IF NOT EXISTS marketplaces (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  api_endpoint VARCHAR(500),
  api_key VARCHAR(500),
  commission_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  sync_enabled BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id SERIAL PRIMARY KEY,
  marketplace_id INTEGER REFERENCES marketplaces(id),
  product_id INTEGER REFERENCES products(id),
  listing_id VARCHAR(100),
  price DECIMAL(10,2),
  stock_quantity INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(marketplace_id, product_id)
);

-- Multi-language tables
CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  language_id INTEGER REFERENCES languages(id),
  key VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  context VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_id, key, context)
);

-- Compliance tables
CREATE TABLE IF NOT EXISTS compliance_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  requirements JSONB NOT NULL,
  is_mandatory BOOLEAN DEFAULT true,
  effective_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_checks (
  id SERIAL PRIMARY KEY,
  rule_id INTEGER REFERENCES compliance_rules(id),
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  checked_by VARCHAR(255) REFERENCES users(id),
  checked_at TIMESTAMP,
  notes TEXT,
  evidence JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image management tables
CREATE TABLE IF NOT EXISTS image_metadata (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  mime_type VARCHAR(100),
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  entity_type VARCHAR(100),
  entity_id VARCHAR(100),
  tags JSONB DEFAULT '[]',
  uploaded_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_transformations (
  id SERIAL PRIMARY KEY,
  original_image_id INTEGER REFERENCES image_metadata(id),
  transformation_type VARCHAR(50),
  parameters JSONB,
  output_filename VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create all indexes
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_branch ON inventory(branch_id);
CREATE INDEX IF NOT EXISTS idx_inventory_active ON inventory(is_active);
CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_branch ON orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_employees_user ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_branch ON employees(branch_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);