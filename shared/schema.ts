import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, decimal, unique, date, uuid, index, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// =============================================================================
// CORE MICROSERVICE TABLES (78+ Tables)
// =============================================================================

// 1. USERS & AUTHENTICATION
export const users = pgTable('users', {
  id: varchar('id').primaryKey().notNull(), // Changed to varchar for Replit Auth
  email: varchar('email', { length: 255 }).unique(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  profileImageUrl: varchar('profile_image_url'),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('user'),
  status: varchar('status', { length: 20 }).default('active'),
  assignedApp: varchar('assigned_app', { length: 50 }),
  department: varchar('department', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  lastLogin: timestamp('last_login'),
  preferredBranchId: integer('preferred_branch_id'),
  currentBranchId: integer('current_branch_id'),
  lastKnownLatitude: decimal('last_known_latitude', { precision: 10, scale: 8 }),
  lastKnownLongitude: decimal('last_known_longitude', { precision: 11, scale: 8 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata')
});

// Type exports for Replit Auth
export type UpsertUser = typeof users.$inferInsert;

// INDUSTRIAL-GRADE LABEL DESIGN SCHEMA ENHANCEMENTS (Phase 0.4)
// =============================================================================
// ENHANCED LABEL DESIGN TABLES WITH PROFESSIONAL CONSTRAINTS
// =============================================================================

// ENHANCED LABEL TEMPLATES - Updated existing table with industrial features (Phase 0.4)

// Media Types for Industrial Label Standards (Avery, etc.)
export const mediaTypes = pgTable('media_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(), // "Avery 5160", "A4 Sheet", etc.
  manufacturer: varchar('manufacturer', { length: 100 }), // Avery, Brother, etc.
  productCode: varchar('product_code', { length: 50 }), // "5160", "L7160", etc.
  
  // Physical Dimensions (in mm)
  labelWidth: decimal('label_width', { precision: 8, scale: 2 }).notNull(),
  labelHeight: decimal('label_height', { precision: 8, scale: 2 }).notNull(),
  pageWidth: decimal('page_width', { precision: 8, scale: 2 }).notNull(),
  pageHeight: decimal('page_height', { precision: 8, scale: 2 }).notNull(),
  
  // Layout Configuration
  labelsPerRow: integer('labels_per_row').notNull(),
  labelsPerColumn: integer('labels_per_column').notNull(),
  totalLabelsPerSheet: integer('total_labels_per_sheet').notNull(),
  
  // Margins and Spacing (in mm)
  marginTop: decimal('margin_top', { precision: 8, scale: 2 }).notNull(),
  marginLeft: decimal('margin_left', { precision: 8, scale: 2 }).notNull(),
  marginRight: decimal('margin_right', { precision: 8, scale: 2 }).notNull(),
  marginBottom: decimal('margin_bottom', { precision: 8, scale: 2 }).notNull(),
  horizontalSpacing: decimal('horizontal_spacing', { precision: 8, scale: 2 }).notNull(),
  verticalSpacing: decimal('vertical_spacing', { precision: 8, scale: 2 }).notNull(),
  
  // Industrial Standards
  industryCompliance: jsonb('industry_compliance'), // GS1, FSSAI compliance flags
  printCompatibility: jsonb('print_compatibility'), // Printer types, DPI requirements
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  unique('unique_media_product_code').on(table.manufacturer, table.productCode),
  index('idx_media_manufacturer').on(table.manufacturer),
  index('idx_media_active').on(table.isActive)
]);

// Enhanced QR Code Audit Trail (Phase 0.4)
export const qrCodeAuditLog = pgTable('qr_code_audit_log', {
  id: serial('id').primaryKey(),
  templateId: integer('template_id').references(() => labelTemplates.id),
  qrType: varchar('qr_type', { length: 50 }).notNull(), // url, text, email, phone, sms, wifi, vcard, whatsapp
  qrContent: text('qr_content').notNull(),
  qrOptions: jsonb('qr_options').notNull(), // size, error correction, colors, etc.
  
  // Generation Details
  generatedBy: varchar('generated_by').references(() => users.id).notNull(),
  companyId: integer('company_id').references(() => companies.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  
  // Technical Details
  imageUrl: varchar('image_url', { length: 500 }),
  imageSize: integer('image_size'), // in bytes
  errorCorrectionLevel: varchar('error_correction_level', { length: 5 }).notNull(),
  
  // Usage Tracking
  scanCount: integer('scan_count').default(0),
  lastScannedAt: timestamp('last_scanned_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  index('idx_qr_audit_template').on(table.templateId),
  index('idx_qr_audit_company_branch').on(table.companyId, table.branchId),
  index('idx_qr_audit_type').on(table.qrType),
  index('idx_qr_audit_created').on(table.createdAt)
]);

// Label Design Jobs (Industrial Printing Queue)
export const labelDesignJobs = pgTable('label_design_jobs', {
  id: serial('id').primaryKey(),
  templateId: integer('template_id').references(() => labelTemplates.id).notNull(),
  jobType: varchar('job_type', { length: 50 }).notNull(), // print, preview, export
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processing, completed, failed
  
  // Job Configuration
  printQuantity: integer('print_quantity').default(1),
  mediaTypeId: integer('media_type_id').references(() => mediaTypes.id).notNull(),
  printerSettings: jsonb('printer_settings'),
  
  // Multi-Product Variable Data (VDP)
  variableData: jsonb('variable_data'), // Array of product data for different labels
  
  // Processing Details
  processedBy: varchar('processed_by').references(() => users.id),
  processingStartedAt: timestamp('processing_started_at'),
  processingCompletedAt: timestamp('processing_completed_at'),
  errorMessage: text('error_message'),
  
  // Output Files
  outputFiles: jsonb('output_files'), // URLs to generated PDFs, images, etc.
  
  // Audit
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  companyId: integer('company_id').references(() => companies.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('idx_design_jobs_template').on(table.templateId),
  index('idx_design_jobs_status').on(table.status),
  index('idx_design_jobs_company_branch').on(table.companyId, table.branchId),
  index('idx_design_jobs_created').on(table.createdAt)
]);

// 2. COMPANIES
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  logo: varchar('logo', { length: 500 }),
  website: varchar('website', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  taxId: varchar('tax_id', { length: 100 }),
  registrationNumber: varchar('registration_number', { length: 100 }),
  industry: varchar('industry', { length: 100 }),
  foundedYear: integer('founded_year'),
  employeeCount: integer('employee_count'),
  annualRevenue: decimal('annual_revenue', { precision: 15, scale: 2 }),
  settings: jsonb('settings'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 3. BRANCHES
export const branches = pgTable('branches', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  managerName: varchar('manager_name', { length: 255 }),
  operatingHours: jsonb('operating_hours'),
  deliveryRadius: decimal('delivery_radius', { precision: 8, scale: 2 }),
  settings: jsonb('settings'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 4. CATEGORIES
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  icon: varchar('icon', { length: 100 }),
  parentId: integer('parent_id').references(() => categories.id),
  sortOrder: integer('sort_order').default(0),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 5. PRODUCTS
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  barcode: varchar('barcode', { length: 100 }),
  categoryId: integer('category_id').references(() => categories.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  weight: decimal('weight', { precision: 8, scale: 3 }),
  unit: varchar('unit', { length: 50 }),
  dimensions: jsonb('dimensions'),
  images: jsonb('images'),
  tags: jsonb('tags'),
  attributes: jsonb('attributes'),
  stockQuantity: integer('stock_quantity').default(0),
  lowStockThreshold: integer('low_stock_threshold').default(10),
  stockStatus: varchar('stock_status', { length: 20 }).default('in_stock'),
  isFeatured: boolean('is_featured').default(false),
  isDigital: boolean('is_digital').default(false),
  isActive: boolean('is_active').default(true),
  status: varchar('status', { length: 20 }).default('active'),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 6. ORDERS
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
  customerId: integer('customer_id').references(() => users.id),
  branchId: integer('branch_id').references(() => branches.id),
  status: varchar('status', { length: 50 }).default('pending'),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
  shippingStatus: varchar('shipping_status', { length: 50 }).default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  billingAddress: jsonb('billing_address'),
  shippingAddress: jsonb('shipping_address'),
  orderNotes: text('order_notes'),
  internalNotes: text('internal_notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 7. ORDER ITEMS
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  productSnapshot: jsonb('product_snapshot'),
  createdAt: timestamp('created_at').defaultNow()
});

// 8. INVENTORY
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  quantity: integer('quantity').notNull().default(0),
  reservedQuantity: integer('reserved_quantity').default(0),
  availableQuantity: integer('available_quantity').default(0),
  reorderPoint: integer('reorder_point').default(10),
  maxStock: integer('max_stock'),
  location: varchar('location', { length: 100 }),
  batchNumber: varchar('batch_number', { length: 100 }),
  expiryDate: date('expiry_date'),
  lastStockUpdate: timestamp('last_stock_update').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 8B. STOCK ALERTS
export const stockAlerts = pgTable('stock_alerts', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  alertType: varchar('alert_type', { length: 50 }).notNull(),
  threshold: integer('threshold').notNull(),
  currentLevel: integer('current_level').notNull(),
  isActive: boolean('is_active').default(true),
  lastTriggered: timestamp('last_triggered'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});



// 9. PAYMENTS
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  paymentGateway: varchar('payment_gateway', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  status: varchar('status', { length: 50 }).default('pending'),
  gatewayResponse: jsonb('gateway_response'),
  failureReason: text('failure_reason'),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 10. NOTIFICATIONS
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('info'),
  channel: varchar('channel', { length: 50 }).default('in_app'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow()
});

// 11. AUDIT LOGS
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: varchar('resource_id', { length: 100 }),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow()
});

// =============================================================================
// ADDITIONAL MICROSERVICE TABLES (60+ More)
// =============================================================================

// 12. ROLES & PERMISSIONS
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  permissions: jsonb('permissions'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  roleId: integer('role_id').references(() => roles.id).notNull(),
  assignedBy: integer('assigned_by').references(() => users.id),
  assignedAt: timestamp('assigned_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true)
});

// 13. USER SESSIONS
export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  sessionToken: text('session_token').notNull().unique(),
  refreshToken: text('refresh_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 14. CUSTOMERS
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  dateOfBirth: date('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  loyaltyPoints: integer('loyalty_points').default(0),
  totalOrders: integer('total_orders').default(0),
  totalSpent: decimal('total_spent', { precision: 12, scale: 2 }).default('0'),
  averageOrderValue: decimal('average_order_value', { precision: 10, scale: 2 }).default('0'),
  lastOrderDate: timestamp('last_order_date'),
  status: varchar('status', { length: 20 }).default('active'),
  source: varchar('source', { length: 50 }),
  tags: jsonb('tags'),
  preferences: jsonb('preferences'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 15. CUSTOMER ADDRESSES
export const customerAddresses = pgTable('customer_addresses', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  isDefault: boolean('is_default').default(false),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  company: varchar('company', { length: 100 }),
  address1: varchar('address1', { length: 255 }).notNull(),
  address2: varchar('address2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  instructions: text('instructions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 16. INVENTORY TRANSACTIONS (Updated to match service requirements)
export const inventoryTransactions = pgTable('inventory_transactions', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(),
  quantity: integer('quantity').notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }),
  referenceId: varchar('reference_id', { length: 255 }),
  referenceType: varchar('reference_type', { length: 50 }),
  notes: text('notes'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

// 17. INVENTORY ADJUSTMENTS (Updated to match service requirements)
export const inventoryAdjustments = pgTable('inventory_adjustments', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  adjustmentType: varchar('adjustment_type', { length: 50 }).notNull(),
  quantity: integer('quantity').notNull(),
  reason: varchar('reason', { length: 255 }).notNull(),
  oldQuantity: integer('old_quantity').notNull(),
  newQuantity: integer('new_quantity').notNull(),
  adjustmentReason: varchar('adjustment_reason', { length: 100 }).notNull(),
  adjustedBy: integer('adjusted_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

// 18. SUPPLIERS
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  website: varchar('website', { length: 255 }),
  contactPerson: varchar('contact_person', { length: 255 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  taxId: varchar('tax_id', { length: 100 }),
  bankDetails: jsonb('bank_details'),
  paymentTerms: varchar('payment_terms', { length: 100 }),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }),
  status: varchar('status', { length: 20 }).default('active'),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 19. PURCHASE ORDERS
export const purchaseOrders = pgTable('purchase_orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
  supplierId: integer('supplier_id').references(() => suppliers.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  status: varchar('status', { length: 50 }).default('draft'),
  orderDate: timestamp('order_date').defaultNow(),
  expectedDate: timestamp('expected_date'),
  receivedDate: timestamp('received_date'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0'),
  shippingAmount: decimal('shipping_amount', { precision: 12, scale: 2 }).default('0'),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  notes: text('notes'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 20. PURCHASE ORDER ITEMS
export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: serial('id').primaryKey(),
  purchaseOrderId: integer('purchase_order_id').references(() => purchaseOrders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  receivedQuantity: integer('received_quantity').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});

// 21. SHIPPING & DELIVERY
export const shippingMethods = pgTable('shipping_methods', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  carrier: varchar('carrier', { length: 100 }),
  estimatedDays: integer('estimated_days'),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  freeShippingThreshold: decimal('free_shipping_threshold', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true),
  zones: jsonb('zones'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const shipments = pgTable('shipments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  shippingMethodId: integer('shipping_method_id').references(() => shippingMethods.id),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  carrier: varchar('carrier', { length: 100 }),
  status: varchar('status', { length: 50 }).default('pending'),
  shippedDate: timestamp('shipped_date'),
  estimatedDeliveryDate: timestamp('estimated_delivery_date'),
  actualDeliveryDate: timestamp('actual_delivery_date'),
  deliveryAddress: jsonb('delivery_address'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 22. DELIVERY ROUTES
export const deliveryRoutes = pgTable('delivery_routes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  driverId: integer('driver_id').references(() => users.id),
  vehicleInfo: jsonb('vehicle_info'),
  routeCoordinates: jsonb('route_coordinates'),
  estimatedDuration: integer('estimated_duration'),
  maxCapacity: integer('max_capacity'),
  status: varchar('status', { length: 50 }).default('active'),
  deliveryDate: date('delivery_date'),
  createdAt: timestamp('created_at').defaultNow()
});

export const deliverySchedule = pgTable('delivery_schedule', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  routeId: integer('route_id').references(() => deliveryRoutes.id),
  deliverySlot: varchar('delivery_slot', { length: 50 }),
  estimatedDeliveryTime: timestamp('estimated_delivery_time'),
  actualDeliveryTime: timestamp('actual_delivery_time'),
  deliveryStatus: varchar('delivery_status', { length: 50 }).default('scheduled'),
  deliveryNotes: text('delivery_notes'),
  deliveryProof: jsonb('delivery_proof'),
  createdAt: timestamp('created_at').defaultNow()
});

// 23. PROMOTIONS & DISCOUNTS
export const promotions = pgTable('promotions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  code: varchar('code', { length: 50 }).unique(),
  type: varchar('type', { length: 50 }).notNull(),
  discountType: varchar('discount_type', { length: 50 }).notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minimumOrderAmount: decimal('minimum_order_amount', { precision: 10, scale: 2 }),
  maximumDiscountAmount: decimal('maximum_discount_amount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  applicableProducts: jsonb('applicable_products'),
  applicableCategories: jsonb('applicable_categories'),
  applicableBranches: jsonb('applicable_branches'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 24. COUPONS
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  promotionId: integer('promotion_id').references(() => promotions.id).notNull(),
  customerId: integer('customer_id').references(() => customers.id),
  code: varchar('code', { length: 50 }).notNull().unique(),
  isUsed: boolean('is_used').default(false),
  usedAt: timestamp('used_at'),
  orderId: integer('order_id').references(() => orders.id),
  createdAt: timestamp('created_at').defaultNow()
});

// 25. LOYALTY PROGRAM
export const loyaltyPrograms = pgTable('loyalty_programs', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  pointsPerRupee: decimal('points_per_rupee', { precision: 5, scale: 2 }).default('1'),
  redemptionRate: decimal('redemption_rate', { precision: 5, scale: 2 }).default('1'),
  minimumRedemption: integer('minimum_redemption').default(100),
  expiryDays: integer('expiry_days'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const loyaltyTransactions = pgTable('loyalty_transactions', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(),
  pointsChange: integer('points_change').notNull(),
  pointsBalance: integer('points_balance').notNull(),
  referenceId: varchar('reference_id', { length: 100 }),
  referenceType: varchar('reference_type', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});

// 26. REVIEWS & RATINGS
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  orderId: integer('order_id').references(() => orders.id),
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  isVerified: boolean('is_verified').default(false),
  isApproved: boolean('is_approved').default(false),
  helpfulCount: integer('helpful_count').default(0),
  images: jsonb('images'),
  response: text('response'),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 27. WISHLISTS
export const wishlists = pgTable('wishlists', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  name: varchar('name', { length: 255 }).default('My Wishlist'),
  isDefault: boolean('is_default').default(true),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  wishlistId: integer('wishlist_id').references(() => wishlists.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  addedAt: timestamp('added_at').defaultNow()
});

// 28. CART
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  quantity: integer('quantity').notNull(),
  addedAt: timestamp('added_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 29. SUBSCRIPTIONS
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  planType: varchar('plan_type', { length: 50 }).notNull(),
  mealType: varchar('meal_type', { length: 50 }).notNull(),
  duration: integer('duration').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  deliveryTime: varchar('delivery_time', { length: 100 }).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata')
});

export const subscriptionItems = pgTable('subscription_items', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').references(() => subscriptions.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  dayOffset: integer('day_offset').default(0),
  createdAt: timestamp('created_at').defaultNow()
});

// 30. ANALYTICS & REPORTING
export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  eventName: varchar('event_name', { length: 100 }).notNull(),
  eventCategory: varchar('event_category', { length: 50 }).notNull(),
  userId: integer('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 100 }),
  properties: jsonb('properties'),
  timestamp: timestamp('timestamp').defaultNow()
});

export const salesReports = pgTable('sales_reports', {
  id: serial('id').primaryKey(),
  reportDate: date('report_date').notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  totalOrders: integer('total_orders').default(0),
  totalRevenue: decimal('total_revenue', { precision: 15, scale: 2 }).default('0'),
  totalCost: decimal('total_cost', { precision: 15, scale: 2 }).default('0'),
  totalProfit: decimal('total_profit', { precision: 15, scale: 2 }).default('0'),
  averageOrderValue: decimal('average_order_value', { precision: 10, scale: 2 }).default('0'),
  newCustomers: integer('new_customers').default(0),
  returningCustomers: integer('returning_customers').default(0),
  topProducts: jsonb('top_products'),
  topCategories: jsonb('top_categories'),
  createdAt: timestamp('created_at').defaultNow()
});

// 31. EMPLOYEES
export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  employeeNumber: varchar('employee_number', { length: 50 }).notNull().unique(),
  department: varchar('department', { length: 100 }),
  position: varchar('position', { length: 100 }),
  branchId: integer('branch_id').references(() => branches.id),
  hireDate: date('hire_date'),
  salary: decimal('salary', { precision: 12, scale: 2 }),
  status: varchar('status', { length: 20 }).default('active'),
  managerId: integer('manager_id').references(() => employees.id),
  createdAt: timestamp('created_at').defaultNow()
});

// 32. ATTENDANCE
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  date: date('date').notNull(),
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  breakStart: timestamp('break_start'),
  breakEnd: timestamp('break_end'),
  totalHours: decimal('total_hours', { precision: 4, scale: 2 }),
  status: varchar('status', { length: 20 }).default('present'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});

// 33. PAYROLL
export const payroll = pgTable('payroll', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  payPeriodStart: date('pay_period_start').notNull(),
  payPeriodEnd: date('pay_period_end').notNull(),
  baseSalary: decimal('base_salary', { precision: 12, scale: 2 }).notNull(),
  overtime: decimal('overtime', { precision: 10, scale: 2 }).default('0'),
  bonus: decimal('bonus', { precision: 10, scale: 2 }).default('0'),
  deductions: decimal('deductions', { precision: 10, scale: 2 }).default('0'),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  netPay: decimal('net_pay', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  paidDate: date('paid_date'),
  createdAt: timestamp('created_at').defaultNow()
});

// 34. VENDORS
export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  contactPerson: varchar('contact_person', { length: 255 }),
  businessType: varchar('business_type', { length: 100 }),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const vendorProducts = pgTable('vendor_products', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  vendorPrice: decimal('vendor_price', { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const vendorPayouts = pgTable('vendor_payouts', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.id).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  period: varchar('period', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  paidDate: date('paid_date'),
  reference: varchar('reference', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow()
});

// 35. FINANCIAL MANAGEMENT
export const financialTransactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  description: text('description'),
  referenceId: varchar('reference_id', { length: 100 }),
  referenceType: varchar('reference_type', { length: 50 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow()
});

export const refunds = pgTable('refunds', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id').references(() => payments.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason'),
  status: varchar('status', { length: 20 }).default('pending'),
  processedDate: date('processed_date'),
  refundReference: varchar('refund_reference', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow()
});

// 36. COMMUNICATION
export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  recipientEmail: varchar('recipient_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  body: text('body'),
  status: varchar('status', { length: 20 }).default('pending'),
  sentAt: timestamp('sent_at'),
  errorMessage: text('error_message'),
  provider: varchar('provider', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const smsLogs = pgTable('sms_logs', {
  id: serial('id').primaryKey(),
  recipientPhone: varchar('recipient_phone', { length: 20 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  sentAt: timestamp('sent_at'),
  errorMessage: text('error_message'),
  provider: varchar('provider', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const notificationTemplates = pgTable('notification_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  body: text('body').notNull(),
  variables: jsonb('variables'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const notificationPreferences = pgTable('notification_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  notificationType: varchar('notification_type', { length: 50 }).notNull(),
  emailEnabled: boolean('email_enabled').default(true),
  smsEnabled: boolean('sms_enabled').default(true),
  pushEnabled: boolean('push_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// 37. SYSTEM CONFIGURATION
export const configurations = pgTable('configurations', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  type: varchar('type', { length: 50 }).default('string'),
  isPublic: boolean('is_public').default(false),
  updatedBy: integer('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  permissions: jsonb('permissions'),
  isActive: boolean('is_active').default(true),
  lastUsed: timestamp('last_used'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const rateLimits = pgTable('rate_limits', {
  id: serial('id').primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  count: integer('count').default(0),
  resetTime: timestamp('reset_time').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// 38. CACHE & PERFORMANCE
export const cacheEntries = pgTable('cache_entries', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const queueJobs = pgTable('queue_jobs', {
  id: serial('id').primaryKey(),
  queue: varchar('queue', { length: 100 }).notNull(),
  payload: jsonb('payload').notNull(),
  attempts: integer('attempts').default(0),
  status: varchar('status', { length: 20 }).default('pending'),
  availableAt: timestamp('available_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// 39. LOGGING & MONITORING
export const systemLogs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  level: varchar('level', { length: 20 }).notNull(),
  message: text('message').notNull(),
  context: jsonb('context'),
  userId: integer('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 100 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const errorLogs = pgTable('error_logs', {
  id: serial('id').primaryKey(),
  errorCode: varchar('error_code', { length: 50 }),
  errorMessage: text('error_message').notNull(),
  stackTrace: text('stack_trace'),
  userId: integer('user_id').references(() => users.id),
  requestPath: varchar('request_path', { length: 500 }),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow()
});

export const performanceMetrics = pgTable('performance_metrics', {
  id: serial('id').primaryKey(),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  responseTime: integer('response_time').notNull(),
  statusCode: integer('status_code').notNull(),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});

// 39B. EXPENSES & TRANSACTIONS
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  vendor: varchar('vendor', { length: 200 }),
  receiptNumber: varchar('receipt_number', { length: 100 }),
  expenseDate: timestamp('expense_date'),
  branchId: integer('branch_id').references(() => branches.id),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const auditTransactions = pgTable('audit_transactions', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  reference: varchar('reference', { length: 100 }),
  transactionDate: timestamp('transaction_date'),
  branchId: integer('branch_id').references(() => branches.id),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 40. LABEL DESIGN & PRINTING SYSTEM
export const labelMediaTypes = pgTable('label_media_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(), // e.g., A4_24, Roll_30x30
  description: text('description'),
  labelWidthMm: decimal('label_width_mm', { precision: 6, scale: 2 }).notNull(),
  labelHeightMm: decimal('label_height_mm', { precision: 6, scale: 2 }).notNull(),
  rows: integer('rows').notNull().default(1),
  columns: integer('columns').notNull().default(1),
  pageWidthMm: decimal('page_width_mm', { precision: 6, scale: 2 }),
  pageHeightMm: decimal('page_height_mm', { precision: 6, scale: 2 }),
  gapXMm: decimal('gap_x_mm', { precision: 6, scale: 2 }).default('0'),
  gapYMm: decimal('gap_y_mm', { precision: 6, scale: 2 }).default('0'),
  marginTopMm: decimal('margin_top_mm', { precision: 6, scale: 2 }).default('0'),
  marginBottomMm: decimal('margin_bottom_mm', { precision: 6, scale: 2 }).default('0'),
  marginLeftMm: decimal('margin_left_mm', { precision: 6, scale: 2 }).default('0'),
  marginRightMm: decimal('margin_right_mm', { precision: 6, scale: 2 }).default('0'),
  mediaType: varchar('media_type', { length: 20 }).notNull().default('sheet'), // sheet, roll
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// ENHANCED LABEL TEMPLATES (Phase 0.4) - Industrial-grade with version control and compliance
export const labelTemplates = pgTable('label_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // price_tag, nutrition_label, qr_label, barcode_label, compliance_label, promotional, shelf_talker
  mediaId: integer('media_id').references(() => labelMediaTypes.id).notNull(),
  templateJson: jsonb('template_json').notNull(), // Field mappings, positions, styles
  previewImageUrl: varchar('preview_image_url', { length: 500 }),
  
  // Industrial Standards & Compliance (Phase 0.4)
  version: integer('version').notNull().default(1),
  industryStandard: varchar('industry_standard', { length: 50 }), // GS1, FSSAI, FDA, etc.
  complianceVersion: varchar('compliance_version', { length: 20 }), // 2024.1, etc.
  
  // Template Metrics & Usage Tracking
  usageCount: integer('usage_count').default(0),
  lastUsedAt: timestamp('last_used_at'),
  
  // Enhanced Multi-Branch & Approval Workflow
  createdBy: integer('created_by').references(() => users.id).notNull(),
  updatedBy: integer('updated_by').references(() => users.id),
  approvedBy: integer('approved_by').references(() => users.id), // For compliance approval
  approvedAt: timestamp('approved_at'),
  companyId: integer('company_id').references(() => companies.id),
  branchId: integer('branch_id').references(() => branches.id),
  isActive: boolean('is_active').default(true),
  isPublic: boolean('is_public').default(false), // Can be used by other branches
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => [
  unique('unique_template_version').on(table.companyId, table.name, table.version),
  index('idx_template_company_branch').on(table.companyId, table.branchId),
  index('idx_template_type').on(table.type),
  index('idx_template_active').on(table.isActive),
  index('idx_template_compliance').on(table.industryStandard, table.complianceVersion)
]);

export const labelPrintJobs = pgTable('label_print_jobs', {
  id: serial('id').primaryKey(),
  jobNumber: varchar('job_number', { length: 50 }).notNull().unique(),
  templateId: integer('template_id').references(() => labelTemplates.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  mediaId: integer('media_id').references(() => labelMediaTypes.id).notNull(),
  printedBy: integer('printed_by').references(() => users.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  quantity: integer('quantity').notNull(),
  format: varchar('format', { length: 10 }).notNull(), // pdf, zpl, png
  serialStart: varchar('serial_start', { length: 50 }),
  serialEnd: varchar('serial_end', { length: 50 }),
  batchId: varchar('batch_id', { length: 100 }),
  expiryDate: date('expiry_date'),
  printerName: varchar('printer_name', { length: 100 }),
  status: varchar('status', { length: 20 }).default('completed'), // pending, printing, completed, failed
  errorMessage: text('error_message'),
  fileUrl: varchar('file_url', { length: 500 }),
  printedAt: timestamp('printed_at').defaultNow(),
  metadata: jsonb('metadata') // Additional job-specific data
});

export const labelPrintLogs = pgTable('label_print_logs', {
  id: serial('id').primaryKey(),
  printJobId: integer('print_job_id').references(() => labelPrintJobs.id).notNull(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  batchId: varchar('batch_id', { length: 100 }),
  expiryDate: date('expiry_date'),
  qrCode: text('qr_code'),
  barcode: varchar('barcode', { length: 100 }),
  imageUrl: varchar('image_url', { length: 500 }),
  productData: jsonb('product_data'), // Snapshot of product data at print time
  isActive: boolean('is_active').default(true), // For label deactivation/recall
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  uniqueSerial: unique().on(table.serialNumber, table.branchId),
}));

// Custom Template Dimensions for Advanced Template Management
export const customTemplateDimensions = pgTable('custom_template_dimensions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  paperSize: varchar('paper_size', { length: 50 }).notNull(), // A4, A3, Letter, Legal, Custom
  paperWidth: decimal('paper_width', { precision: 6, scale: 2 }).notNull(), // mm
  paperHeight: decimal('paper_height', { precision: 6, scale: 2 }).notNull(), // mm
  labelWidth: decimal('label_width', { precision: 6, scale: 2 }).notNull(), // mm
  labelHeight: decimal('label_height', { precision: 6, scale: 2 }).notNull(), // mm
  horizontalCount: integer('horizontal_count').notNull(),
  verticalCount: integer('vertical_count').notNull(),
  marginTop: decimal('margin_top', { precision: 6, scale: 2 }).notNull(), // mm
  marginBottom: decimal('margin_bottom', { precision: 6, scale: 2 }).notNull(), // mm
  marginLeft: decimal('margin_left', { precision: 6, scale: 2 }).notNull(), // mm
  marginRight: decimal('margin_right', { precision: 6, scale: 2 }).notNull(), // mm
  horizontalGap: decimal('horizontal_gap', { precision: 6, scale: 2 }).notNull(), // mm
  verticalGap: decimal('vertical_gap', { precision: 6, scale: 2 }).notNull(), // mm
  cornerRadius: decimal('corner_radius', { precision: 6, scale: 2 }).default('0'), // mm
  templateType: varchar('template_type', { length: 50 }).notNull(), // address_label, price_tag, product_label, barcode_label, shipping_label, custom
  createdBy: integer('created_by').references(() => users.id).notNull(),
  companyId: integer('company_id').references(() => companies.id),
  branchId: integer('branch_id').references(() => branches.id),
  isActive: boolean('is_active').default(true),
  isPublic: boolean('is_public').default(false), // Can be used by other branches
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const labelPrintSettings = pgTable('label_print_settings', {
  id: serial('id').primaryKey(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  defaultMediaId: integer('default_media_id').references(() => labelMediaTypes.id),
  printerName: varchar('printer_name', { length: 100 }),
  printerIp: varchar('printer_ip', { length: 45 }),
  serialPrefix: varchar('serial_prefix', { length: 20 }), // e.g., HYD, TP
  serialCounter: integer('serial_counter').default(1),
  expiryDaysDefault: integer('expiry_days_default').default(365),
  qrBaseUrl: varchar('qr_base_url', { length: 200 }),
  companyLogo: varchar('company_logo', { length: 500 }),
  fssaiLicense: varchar('fssai_license', { length: 100 }),
  fssaiLogoUrl: varchar('fssai_logo_url', { length: 500 }),
  settings: jsonb('settings'),
  updatedBy: integer('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  uniqueBranch: unique().on(table.branchId),
}));

// 41. WEBHOOKS & INTEGRATIONS
export const webhooks = pgTable('webhooks', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  events: jsonb('events').notNull(),
  secret: varchar('secret', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const webhookDeliveries = pgTable('webhook_deliveries', {
  id: serial('id').primaryKey(),
  webhookId: integer('webhook_id').references(() => webhooks.id).notNull(),
  event: varchar('event', { length: 100 }).notNull(),
  payload: jsonb('payload').notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  attempts: integer('attempts').default(0),
  lastAttempt: timestamp('last_attempt'),
  response: text('response'),
  createdAt: timestamp('created_at').defaultNow()
});

// 49. TRADITIONAL HOME SUPPLIES
export const traditionalItems = pgTable('traditional_items', {
  id: serial('id').primaryKey(),
  nameEnglish: varchar('name_english', { length: 255 }).notNull(),
  nameTelugu: varchar('name_telugu', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  ordinaryPrice: decimal('ordinary_price', { precision: 10, scale: 2 }).notNull(),
  mediumPrice: decimal('medium_price', { precision: 10, scale: 2 }).notNull(),
  bestPrice: decimal('best_price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true),
  region: varchar('region', { length: 100 }).default('AP_TG'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Branch-specific Traditional Items
export const branchTraditionalItems = pgTable('branch_traditional_items', {
  id: serial('id').primaryKey(),
  branchId: integer('branch_id').notNull(),
  itemName: varchar('item_name', { length: 255 }).notNull(),
  itemNameTelugu: varchar('item_name_telugu', { length: 255 }),
  category: varchar('category', { length: 100 }),
  categoryTelugu: varchar('category_telugu', { length: 100 }),
  unit: varchar('unit', { length: 50 }).default('kg'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).default('0.00'),
  qualityTier: varchar('quality_tier', { length: 20 }).default('medium'),
  availabilityStatus: varchar('availability_status', { length: 50 }).default('available'),
  seasonal: boolean('seasonal').default(false),
  region: varchar('region', { length: 50 }).default('AP_TG'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const traditionalOrders = pgTable('traditional_orders', {
  id: serial('id').primaryKey(),
  customerId: varchar('customer_id').references(() => users.id),
  orderType: varchar('order_type', { length: 50 }).default('traditional'),
  qualityTier: varchar('quality_tier', { length: 20 }).notNull(), // 'ordinary', 'medium', 'best'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  selectedVendorId: integer('selected_vendor_id').references(() => vendors.id),
  deliveryAddress: text('delivery_address').notNull(),
  orderStatus: varchar('order_status', { length: 50 }).default('pending'),
  orderDate: timestamp('order_date').defaultNow(),
  deliveryDate: timestamp('delivery_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const traditionalOrderItems = pgTable('traditional_order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => traditionalOrders.id),
  itemId: integer('item_id').references(() => traditionalItems.id),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;
export type Branch = typeof branches.$inferSelect;
export type InsertBranch = typeof branches.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// Label Design System Types
export type LabelMediaType = typeof labelMediaTypes.$inferSelect;
export type InsertLabelMediaType = typeof labelMediaTypes.$inferInsert;
export type LabelTemplate = typeof labelTemplates.$inferSelect;
export type InsertLabelTemplate = typeof labelTemplates.$inferInsert;
export type LabelPrintJob = typeof labelPrintJobs.$inferSelect;
export type InsertLabelPrintJob = typeof labelPrintJobs.$inferInsert;
export type LabelPrintLog = typeof labelPrintLogs.$inferSelect;
export type InsertLabelPrintLog = typeof labelPrintLogs.$inferInsert;
export type LabelPrintSettings = typeof labelPrintSettings.$inferSelect;
export type InsertLabelPrintSettings = typeof labelPrintSettings.$inferInsert;
export type CustomTemplateDimensions = typeof customTemplateDimensions.$inferSelect;
export type InsertCustomTemplateDimensions = typeof customTemplateDimensions.$inferInsert;

// Content Management Tables
export const contentItems = pgTable('content_items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('draft'),
  publishedAt: timestamp('published_at'),
  metaDescription: text('meta_description'),
  tags: jsonb('tags'),
  categoryId: integer('category_id').references(() => categories.id),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  content: text('content'),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = typeof contentItems.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

// TYPE EXPORTS FOR ENHANCED LABEL DESIGN SYSTEM (Phase 0.4)
export type MediaType = typeof mediaTypes.$inferSelect;
export type InsertMediaType = typeof mediaTypes.$inferInsert;
export type QRCodeAuditLog = typeof qrCodeAuditLog.$inferSelect;
export type InsertQRCodeAuditLog = typeof qrCodeAuditLog.$inferInsert;
export type LabelDesignJob = typeof labelDesignJobs.$inferSelect;
export type InsertLabelDesignJob = typeof labelDesignJobs.$inferInsert;

// =============================================================================
// ENHANCED RELATIONSHIP DEFINITIONS (Phase 0.4)
// =============================================================================

// Enhanced Label Design Relationships
export const labelTemplatesRelations = relations(labelTemplates, ({ one, many }) => ({
  company: one(companies, { fields: [labelTemplates.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [labelTemplates.branchId], references: [branches.id] }),
  mediaType: one(mediaTypes, { fields: [labelTemplates.mediaId], references: [mediaTypes.id] }),
  createdByUser: one(users, { fields: [labelTemplates.createdBy], references: [users.id] }),
  updatedByUser: one(users, { fields: [labelTemplates.updatedBy], references: [users.id] }),
  approvedByUser: one(users, { fields: [labelTemplates.approvedBy], references: [users.id] }),
  qrCodes: many(qrCodeAuditLog),
  designJobs: many(labelDesignJobs),
}));

export const mediaTypesRelations = relations(mediaTypes, ({ many }) => ({
  templates: many(labelTemplates),
  designJobs: many(labelDesignJobs),
}));

export const qrCodeAuditLogRelations = relations(qrCodeAuditLog, ({ one }) => ({
  template: one(labelTemplates, { fields: [qrCodeAuditLog.templateId], references: [labelTemplates.id] }),
  generatedByUser: one(users, { fields: [qrCodeAuditLog.generatedBy], references: [users.id] }),
  company: one(companies, { fields: [qrCodeAuditLog.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [qrCodeAuditLog.branchId], references: [branches.id] }),
}));

export const labelDesignJobsRelations = relations(labelDesignJobs, ({ one }) => ({
  template: one(labelTemplates, { fields: [labelDesignJobs.templateId], references: [labelTemplates.id] }),
  mediaType: one(mediaTypes, { fields: [labelDesignJobs.mediaTypeId], references: [mediaTypes.id] }),
  createdByUser: one(users, { fields: [labelDesignJobs.createdBy], references: [users.id] }),
  processedByUser: one(users, { fields: [labelDesignJobs.processedBy], references: [users.id] }),
  company: one(companies, { fields: [labelDesignJobs.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [labelDesignJobs.branchId], references: [branches.id] }),
}));