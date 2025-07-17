"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refunds = exports.financialTransactions = exports.vendorPayouts = exports.vendorProducts = exports.vendors = exports.payroll = exports.attendance = exports.employees = exports.salesReports = exports.analyticsEvents = exports.subscriptionItems = exports.subscriptions = exports.cartItems = exports.wishlistItems = exports.wishlists = exports.reviews = exports.loyaltyTransactions = exports.loyaltyPrograms = exports.coupons = exports.promotions = exports.deliverySchedule = exports.deliveryRoutes = exports.shipments = exports.shippingMethods = exports.purchaseOrderItems = exports.purchaseOrders = exports.suppliers = exports.inventoryAdjustments = exports.inventoryTransactions = exports.customerAddresses = exports.customers = exports.userSessions = exports.userRoles = exports.roles = exports.auditLogs = exports.notifications = exports.payments = exports.stockAlerts = exports.inventory = exports.orderItems = exports.orders = exports.products = exports.categories = exports.branches = exports.companies = exports.labelDesignJobs = exports.qrCodeAuditLog = exports.mediaTypes = exports.users = exports.sessions = void 0;
exports.labelDesignJobsRelations = exports.qrCodeAuditLogRelations = exports.mediaTypesRelations = exports.labelTemplatesRelations = exports.pages = exports.contentItems = exports.traditionalOrderItems = exports.traditionalOrders = exports.branchTraditionalItems = exports.traditionalItems = exports.webhookDeliveries = exports.webhooks = exports.labelPrintSettings = exports.customTemplateDimensions = exports.labelPrintLogs = exports.labelPrintJobs = exports.labelTemplates = exports.labelMediaTypes = exports.auditTransactions = exports.expenses = exports.performanceMetrics = exports.errorLogs = exports.systemLogs = exports.queueJobs = exports.cacheEntries = exports.rateLimits = exports.apiKeys = exports.configurations = exports.notificationPreferences = exports.notificationTemplates = exports.smsLogs = exports.emailLogs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, (table) => [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.varchar)('id').primaryKey().notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique(),
    firstName: (0, pg_core_1.varchar)('first_name'),
    lastName: (0, pg_core_1.varchar)('last_name'),
    profileImageUrl: (0, pg_core_1.varchar)('profile_image_url'),
    name: (0, pg_core_1.varchar)('name', { length: 255 }),
    role: (0, pg_core_1.varchar)('role', { length: 50 }).default('user'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    assignedApp: (0, pg_core_1.varchar)('assigned_app', { length: 50 }),
    department: (0, pg_core_1.varchar)('department', { length: 100 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    emailVerified: (0, pg_core_1.boolean)('email_verified').default(false),
    lastLogin: (0, pg_core_1.timestamp)('last_login'),
    preferredBranchId: (0, pg_core_1.integer)('preferred_branch_id'),
    currentBranchId: (0, pg_core_1.integer)('current_branch_id'),
    lastKnownLatitude: (0, pg_core_1.decimal)('last_known_latitude', { precision: 10, scale: 8 }),
    lastKnownLongitude: (0, pg_core_1.decimal)('last_known_longitude', { precision: 11, scale: 8 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    metadata: (0, pg_core_1.jsonb)('metadata')
});
exports.mediaTypes = (0, pg_core_1.pgTable)('media_types', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    manufacturer: (0, pg_core_1.varchar)('manufacturer', { length: 100 }),
    productCode: (0, pg_core_1.varchar)('product_code', { length: 50 }),
    labelWidth: (0, pg_core_1.decimal)('label_width', { precision: 8, scale: 2 }).notNull(),
    labelHeight: (0, pg_core_1.decimal)('label_height', { precision: 8, scale: 2 }).notNull(),
    pageWidth: (0, pg_core_1.decimal)('page_width', { precision: 8, scale: 2 }).notNull(),
    pageHeight: (0, pg_core_1.decimal)('page_height', { precision: 8, scale: 2 }).notNull(),
    labelsPerRow: (0, pg_core_1.integer)('labels_per_row').notNull(),
    labelsPerColumn: (0, pg_core_1.integer)('labels_per_column').notNull(),
    totalLabelsPerSheet: (0, pg_core_1.integer)('total_labels_per_sheet').notNull(),
    marginTop: (0, pg_core_1.decimal)('margin_top', { precision: 8, scale: 2 }).notNull(),
    marginLeft: (0, pg_core_1.decimal)('margin_left', { precision: 8, scale: 2 }).notNull(),
    marginRight: (0, pg_core_1.decimal)('margin_right', { precision: 8, scale: 2 }).notNull(),
    marginBottom: (0, pg_core_1.decimal)('margin_bottom', { precision: 8, scale: 2 }).notNull(),
    horizontalSpacing: (0, pg_core_1.decimal)('horizontal_spacing', { precision: 8, scale: 2 }).notNull(),
    verticalSpacing: (0, pg_core_1.decimal)('vertical_spacing', { precision: 8, scale: 2 }).notNull(),
    industryCompliance: (0, pg_core_1.jsonb)('industry_compliance'),
    printCompatibility: (0, pg_core_1.jsonb)('print_compatibility'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
}, (table) => [
    (0, pg_core_1.unique)('unique_media_product_code').on(table.manufacturer, table.productCode),
    (0, pg_core_1.index)('idx_media_manufacturer').on(table.manufacturer),
    (0, pg_core_1.index)('idx_media_active').on(table.isActive)
]);
exports.qrCodeAuditLog = (0, pg_core_1.pgTable)('qr_code_audit_log', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    templateId: (0, pg_core_1.integer)('template_id').references(() => exports.labelTemplates.id),
    qrType: (0, pg_core_1.varchar)('qr_type', { length: 50 }).notNull(),
    qrContent: (0, pg_core_1.text)('qr_content').notNull(),
    qrOptions: (0, pg_core_1.jsonb)('qr_options').notNull(),
    generatedBy: (0, pg_core_1.varchar)('generated_by').references(() => exports.users.id).notNull(),
    companyId: (0, pg_core_1.integer)('company_id').references(() => exports.companies.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    imageUrl: (0, pg_core_1.varchar)('image_url', { length: 500 }),
    imageSize: (0, pg_core_1.integer)('image_size'),
    errorCorrectionLevel: (0, pg_core_1.varchar)('error_correction_level', { length: 5 }).notNull(),
    scanCount: (0, pg_core_1.integer)('scan_count').default(0),
    lastScannedAt: (0, pg_core_1.timestamp)('last_scanned_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
}, (table) => [
    (0, pg_core_1.index)('idx_qr_audit_template').on(table.templateId),
    (0, pg_core_1.index)('idx_qr_audit_company_branch').on(table.companyId, table.branchId),
    (0, pg_core_1.index)('idx_qr_audit_type').on(table.qrType),
    (0, pg_core_1.index)('idx_qr_audit_created').on(table.createdAt)
]);
exports.labelDesignJobs = (0, pg_core_1.pgTable)('label_design_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    templateId: (0, pg_core_1.integer)('template_id').references(() => exports.labelTemplates.id).notNull(),
    jobType: (0, pg_core_1.varchar)('job_type', { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).notNull().default('pending'),
    printQuantity: (0, pg_core_1.integer)('print_quantity').default(1),
    mediaTypeId: (0, pg_core_1.integer)('media_type_id').references(() => exports.mediaTypes.id).notNull(),
    printerSettings: (0, pg_core_1.jsonb)('printer_settings'),
    variableData: (0, pg_core_1.jsonb)('variable_data'),
    processedBy: (0, pg_core_1.varchar)('processed_by').references(() => exports.users.id),
    processingStartedAt: (0, pg_core_1.timestamp)('processing_started_at'),
    processingCompletedAt: (0, pg_core_1.timestamp)('processing_completed_at'),
    errorMessage: (0, pg_core_1.text)('error_message'),
    outputFiles: (0, pg_core_1.jsonb)('output_files'),
    createdBy: (0, pg_core_1.varchar)('created_by').references(() => exports.users.id).notNull(),
    companyId: (0, pg_core_1.integer)('company_id').references(() => exports.companies.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull()
}, (table) => [
    (0, pg_core_1.index)('idx_design_jobs_template').on(table.templateId),
    (0, pg_core_1.index)('idx_design_jobs_status').on(table.status),
    (0, pg_core_1.index)('idx_design_jobs_company_branch').on(table.companyId, table.branchId),
    (0, pg_core_1.index)('idx_design_jobs_created').on(table.createdAt)
]);
exports.companies = (0, pg_core_1.pgTable)('companies', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    logo: (0, pg_core_1.varchar)('logo', { length: 500 }),
    website: (0, pg_core_1.varchar)('website', { length: 255 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    address: (0, pg_core_1.text)('address'),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    country: (0, pg_core_1.varchar)('country', { length: 100 }),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 20 }),
    taxId: (0, pg_core_1.varchar)('tax_id', { length: 100 }),
    registrationNumber: (0, pg_core_1.varchar)('registration_number', { length: 100 }),
    industry: (0, pg_core_1.varchar)('industry', { length: 100 }),
    foundedYear: (0, pg_core_1.integer)('founded_year'),
    employeeCount: (0, pg_core_1.integer)('employee_count'),
    annualRevenue: (0, pg_core_1.decimal)('annual_revenue', { precision: 15, scale: 2 }),
    settings: (0, pg_core_1.jsonb)('settings'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.branches = (0, pg_core_1.pgTable)('branches', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    companyId: (0, pg_core_1.integer)('company_id').references(() => exports.companies.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    city: (0, pg_core_1.varchar)('city', { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)('state', { length: 100 }).notNull(),
    country: (0, pg_core_1.varchar)('country', { length: 100 }).notNull(),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 20 }),
    latitude: (0, pg_core_1.decimal)('latitude', { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.decimal)('longitude', { precision: 11, scale: 8 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    managerName: (0, pg_core_1.varchar)('manager_name', { length: 255 }),
    operatingHours: (0, pg_core_1.jsonb)('operating_hours'),
    deliveryRadius: (0, pg_core_1.decimal)('delivery_radius', { precision: 8, scale: 2 }),
    settings: (0, pg_core_1.jsonb)('settings'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    image: (0, pg_core_1.varchar)('image', { length: 500 }),
    imageUrl: (0, pg_core_1.varchar)('image_url', { length: 500 }),
    icon: (0, pg_core_1.varchar)('icon', { length: 100 }),
    parentId: (0, pg_core_1.integer)('parent_id').references(() => exports.categories.id),
    sortOrder: (0, pg_core_1.integer)('sort_order').default(0),
    seoTitle: (0, pg_core_1.varchar)('seo_title', { length: 255 }),
    seoDescription: (0, pg_core_1.text)('seo_description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.products = (0, pg_core_1.pgTable)('products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    shortDescription: (0, pg_core_1.text)('short_description'),
    sku: (0, pg_core_1.varchar)('sku', { length: 100 }).notNull().unique(),
    barcode: (0, pg_core_1.varchar)('barcode', { length: 100 }),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.categories.id),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    salePrice: (0, pg_core_1.decimal)('sale_price', { precision: 10, scale: 2 }),
    costPrice: (0, pg_core_1.decimal)('cost_price', { precision: 10, scale: 2 }),
    weight: (0, pg_core_1.decimal)('weight', { precision: 8, scale: 3 }),
    unit: (0, pg_core_1.varchar)('unit', { length: 50 }),
    dimensions: (0, pg_core_1.jsonb)('dimensions'),
    images: (0, pg_core_1.jsonb)('images'),
    tags: (0, pg_core_1.jsonb)('tags'),
    attributes: (0, pg_core_1.jsonb)('attributes'),
    stockQuantity: (0, pg_core_1.integer)('stock_quantity').default(0),
    lowStockThreshold: (0, pg_core_1.integer)('low_stock_threshold').default(10),
    stockStatus: (0, pg_core_1.varchar)('stock_status', { length: 20 }).default('in_stock'),
    isFeatured: (0, pg_core_1.boolean)('is_featured').default(false),
    isDigital: (0, pg_core_1.boolean)('is_digital').default(false),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    seoTitle: (0, pg_core_1.varchar)('seo_title', { length: 255 }),
    seoDescription: (0, pg_core_1.text)('seo_description'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.orders = (0, pg_core_1.pgTable)('orders', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderNumber: (0, pg_core_1.varchar)('order_number', { length: 100 }).notNull().unique(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.users.id),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('pending'),
    paymentStatus: (0, pg_core_1.varchar)('payment_status', { length: 50 }).default('pending'),
    shippingStatus: (0, pg_core_1.varchar)('shipping_status', { length: 50 }).default('pending'),
    subtotal: (0, pg_core_1.decimal)('subtotal', { precision: 10, scale: 2 }).notNull(),
    taxAmount: (0, pg_core_1.decimal)('tax_amount', { precision: 10, scale: 2 }).default('0'),
    shippingAmount: (0, pg_core_1.decimal)('shipping_amount', { precision: 10, scale: 2 }).default('0'),
    discountAmount: (0, pg_core_1.decimal)('discount_amount', { precision: 10, scale: 2 }).default('0'),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR'),
    billingAddress: (0, pg_core_1.jsonb)('billing_address'),
    shippingAddress: (0, pg_core_1.jsonb)('shipping_address'),
    orderNotes: (0, pg_core_1.text)('order_notes'),
    internalNotes: (0, pg_core_1.text)('internal_notes'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.orderItems = (0, pg_core_1.pgTable)('order_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitPrice: (0, pg_core_1.decimal)('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }).notNull(),
    productSnapshot: (0, pg_core_1.jsonb)('product_snapshot'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.inventory = (0, pg_core_1.pgTable)('inventory', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(0),
    reservedQuantity: (0, pg_core_1.integer)('reserved_quantity').default(0),
    availableQuantity: (0, pg_core_1.integer)('available_quantity').default(0),
    reorderPoint: (0, pg_core_1.integer)('reorder_point').default(10),
    maxStock: (0, pg_core_1.integer)('max_stock'),
    location: (0, pg_core_1.varchar)('location', { length: 100 }),
    batchNumber: (0, pg_core_1.varchar)('batch_number', { length: 100 }),
    expiryDate: (0, pg_core_1.date)('expiry_date'),
    lastStockUpdate: (0, pg_core_1.timestamp)('last_stock_update').defaultNow(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.stockAlerts = (0, pg_core_1.pgTable)('stock_alerts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    alertType: (0, pg_core_1.varchar)('alert_type', { length: 50 }).notNull(),
    threshold: (0, pg_core_1.integer)('threshold').notNull(),
    currentLevel: (0, pg_core_1.integer)('current_level').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    lastTriggered: (0, pg_core_1.timestamp)('last_triggered'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.payments = (0, pg_core_1.pgTable)('payments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id),
    paymentMethod: (0, pg_core_1.varchar)('payment_method', { length: 50 }).notNull(),
    paymentGateway: (0, pg_core_1.varchar)('payment_gateway', { length: 50 }),
    transactionId: (0, pg_core_1.varchar)('transaction_id', { length: 255 }),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR'),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('pending'),
    gatewayResponse: (0, pg_core_1.jsonb)('gateway_response'),
    failureReason: (0, pg_core_1.text)('failure_reason'),
    refundAmount: (0, pg_core_1.decimal)('refund_amount', { precision: 10, scale: 2 }).default('0'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).default('info'),
    channel: (0, pg_core_1.varchar)('channel', { length: 50 }).default('in_app'),
    isRead: (0, pg_core_1.boolean)('is_read').default(false),
    readAt: (0, pg_core_1.timestamp)('read_at'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    action: (0, pg_core_1.varchar)('action', { length: 100 }).notNull(),
    resourceType: (0, pg_core_1.varchar)('resource_type', { length: 100 }).notNull(),
    resourceId: (0, pg_core_1.varchar)('resource_id', { length: 100 }),
    oldValues: (0, pg_core_1.jsonb)('old_values'),
    newValues: (0, pg_core_1.jsonb)('new_values'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.roles = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 50 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    permissions: (0, pg_core_1.jsonb)('permissions'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.userRoles = (0, pg_core_1.pgTable)('user_roles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    roleId: (0, pg_core_1.integer)('role_id').references(() => exports.roles.id).notNull(),
    assignedBy: (0, pg_core_1.integer)('assigned_by').references(() => exports.users.id),
    assignedAt: (0, pg_core_1.timestamp)('assigned_at').defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true)
});
exports.userSessions = (0, pg_core_1.pgTable)('user_sessions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    sessionToken: (0, pg_core_1.text)('session_token').notNull().unique(),
    refreshToken: (0, pg_core_1.text)('refresh_token').notNull().unique(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.customers = (0, pg_core_1.pgTable)('customers', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).unique(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    dateOfBirth: (0, pg_core_1.date)('date_of_birth'),
    gender: (0, pg_core_1.varchar)('gender', { length: 10 }),
    loyaltyPoints: (0, pg_core_1.integer)('loyalty_points').default(0),
    totalOrders: (0, pg_core_1.integer)('total_orders').default(0),
    totalSpent: (0, pg_core_1.decimal)('total_spent', { precision: 12, scale: 2 }).default('0'),
    averageOrderValue: (0, pg_core_1.decimal)('average_order_value', { precision: 10, scale: 2 }).default('0'),
    lastOrderDate: (0, pg_core_1.timestamp)('last_order_date'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    source: (0, pg_core_1.varchar)('source', { length: 50 }),
    tags: (0, pg_core_1.jsonb)('tags'),
    preferences: (0, pg_core_1.jsonb)('preferences'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.customerAddresses = (0, pg_core_1.pgTable)('customer_addresses', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 20 }).notNull(),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }),
    company: (0, pg_core_1.varchar)('company', { length: 100 }),
    address1: (0, pg_core_1.varchar)('address1', { length: 255 }).notNull(),
    address2: (0, pg_core_1.varchar)('address2', { length: 255 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)('state', { length: 100 }).notNull(),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 20 }).notNull(),
    country: (0, pg_core_1.varchar)('country', { length: 100 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    latitude: (0, pg_core_1.decimal)('latitude', { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.decimal)('longitude', { precision: 11, scale: 8 }),
    instructions: (0, pg_core_1.text)('instructions'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.inventoryTransactions = (0, pg_core_1.pgTable)('inventory_transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    transactionType: (0, pg_core_1.varchar)('transaction_type', { length: 50 }).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitCost: (0, pg_core_1.decimal)('unit_cost', { precision: 10, scale: 2 }),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 255 }),
    referenceType: (0, pg_core_1.varchar)('reference_type', { length: 50 }),
    notes: (0, pg_core_1.text)('notes'),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.inventoryAdjustments = (0, pg_core_1.pgTable)('inventory_adjustments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    adjustmentType: (0, pg_core_1.varchar)('adjustment_type', { length: 50 }).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    reason: (0, pg_core_1.varchar)('reason', { length: 255 }).notNull(),
    oldQuantity: (0, pg_core_1.integer)('old_quantity').notNull(),
    newQuantity: (0, pg_core_1.integer)('new_quantity').notNull(),
    adjustmentReason: (0, pg_core_1.varchar)('adjustment_reason', { length: 100 }).notNull(),
    adjustedBy: (0, pg_core_1.integer)('adjusted_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.suppliers = (0, pg_core_1.pgTable)('suppliers', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull().unique(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    website: (0, pg_core_1.varchar)('website', { length: 255 }),
    contactPerson: (0, pg_core_1.varchar)('contact_person', { length: 255 }),
    address: (0, pg_core_1.text)('address'),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    country: (0, pg_core_1.varchar)('country', { length: 100 }),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 20 }),
    taxId: (0, pg_core_1.varchar)('tax_id', { length: 100 }),
    bankDetails: (0, pg_core_1.jsonb)('bank_details'),
    paymentTerms: (0, pg_core_1.varchar)('payment_terms', { length: 100 }),
    creditLimit: (0, pg_core_1.decimal)('credit_limit', { precision: 12, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    rating: (0, pg_core_1.decimal)('rating', { precision: 3, scale: 2 }),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.purchaseOrders = (0, pg_core_1.pgTable)('purchase_orders', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderNumber: (0, pg_core_1.varchar)('order_number', { length: 100 }).notNull().unique(),
    supplierId: (0, pg_core_1.integer)('supplier_id').references(() => exports.suppliers.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('draft'),
    orderDate: (0, pg_core_1.timestamp)('order_date').defaultNow(),
    expectedDate: (0, pg_core_1.timestamp)('expected_date'),
    receivedDate: (0, pg_core_1.timestamp)('received_date'),
    subtotal: (0, pg_core_1.decimal)('subtotal', { precision: 12, scale: 2 }).notNull(),
    taxAmount: (0, pg_core_1.decimal)('tax_amount', { precision: 12, scale: 2 }).default('0'),
    shippingAmount: (0, pg_core_1.decimal)('shipping_amount', { precision: 12, scale: 2 }).default('0'),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 12, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR'),
    notes: (0, pg_core_1.text)('notes'),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.purchaseOrderItems = (0, pg_core_1.pgTable)('purchase_order_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    purchaseOrderId: (0, pg_core_1.integer)('purchase_order_id').references(() => exports.purchaseOrders.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitPrice: (0, pg_core_1.decimal)('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }).notNull(),
    receivedQuantity: (0, pg_core_1.integer)('received_quantity').default(0),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.shippingMethods = (0, pg_core_1.pgTable)('shipping_methods', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    carrier: (0, pg_core_1.varchar)('carrier', { length: 100 }),
    estimatedDays: (0, pg_core_1.integer)('estimated_days'),
    cost: (0, pg_core_1.decimal)('cost', { precision: 10, scale: 2 }),
    freeShippingThreshold: (0, pg_core_1.decimal)('free_shipping_threshold', { precision: 10, scale: 2 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    zones: (0, pg_core_1.jsonb)('zones'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.shipments = (0, pg_core_1.pgTable)('shipments', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id).notNull(),
    shippingMethodId: (0, pg_core_1.integer)('shipping_method_id').references(() => exports.shippingMethods.id),
    trackingNumber: (0, pg_core_1.varchar)('tracking_number', { length: 100 }),
    carrier: (0, pg_core_1.varchar)('carrier', { length: 100 }),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('pending'),
    shippedDate: (0, pg_core_1.timestamp)('shipped_date'),
    estimatedDeliveryDate: (0, pg_core_1.timestamp)('estimated_delivery_date'),
    actualDeliveryDate: (0, pg_core_1.timestamp)('actual_delivery_date'),
    deliveryAddress: (0, pg_core_1.jsonb)('delivery_address'),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.deliveryRoutes = (0, pg_core_1.pgTable)('delivery_routes', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    driverId: (0, pg_core_1.integer)('driver_id').references(() => exports.users.id),
    vehicleInfo: (0, pg_core_1.jsonb)('vehicle_info'),
    routeCoordinates: (0, pg_core_1.jsonb)('route_coordinates'),
    estimatedDuration: (0, pg_core_1.integer)('estimated_duration'),
    maxCapacity: (0, pg_core_1.integer)('max_capacity'),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('active'),
    deliveryDate: (0, pg_core_1.date)('delivery_date'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.deliverySchedule = (0, pg_core_1.pgTable)('delivery_schedule', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id),
    routeId: (0, pg_core_1.integer)('route_id').references(() => exports.deliveryRoutes.id),
    deliverySlot: (0, pg_core_1.varchar)('delivery_slot', { length: 50 }),
    estimatedDeliveryTime: (0, pg_core_1.timestamp)('estimated_delivery_time'),
    actualDeliveryTime: (0, pg_core_1.timestamp)('actual_delivery_time'),
    deliveryStatus: (0, pg_core_1.varchar)('delivery_status', { length: 50 }).default('scheduled'),
    deliveryNotes: (0, pg_core_1.text)('delivery_notes'),
    deliveryProof: (0, pg_core_1.jsonb)('delivery_proof'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.promotions = (0, pg_core_1.pgTable)('promotions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).unique(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    discountType: (0, pg_core_1.varchar)('discount_type', { length: 50 }).notNull(),
    discountValue: (0, pg_core_1.decimal)('discount_value', { precision: 10, scale: 2 }).notNull(),
    minimumOrderAmount: (0, pg_core_1.decimal)('minimum_order_amount', { precision: 10, scale: 2 }),
    maximumDiscountAmount: (0, pg_core_1.decimal)('maximum_discount_amount', { precision: 10, scale: 2 }),
    usageLimit: (0, pg_core_1.integer)('usage_limit'),
    usageCount: (0, pg_core_1.integer)('usage_count').default(0),
    startDate: (0, pg_core_1.timestamp)('start_date').notNull(),
    endDate: (0, pg_core_1.timestamp)('end_date').notNull(),
    applicableProducts: (0, pg_core_1.jsonb)('applicable_products'),
    applicableCategories: (0, pg_core_1.jsonb)('applicable_categories'),
    applicableBranches: (0, pg_core_1.jsonb)('applicable_branches'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.coupons = (0, pg_core_1.pgTable)('coupons', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    promotionId: (0, pg_core_1.integer)('promotion_id').references(() => exports.promotions.id).notNull(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull().unique(),
    isUsed: (0, pg_core_1.boolean)('is_used').default(false),
    usedAt: (0, pg_core_1.timestamp)('used_at'),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.loyaltyPrograms = (0, pg_core_1.pgTable)('loyalty_programs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    pointsPerRupee: (0, pg_core_1.decimal)('points_per_rupee', { precision: 5, scale: 2 }).default('1'),
    redemptionRate: (0, pg_core_1.decimal)('redemption_rate', { precision: 5, scale: 2 }).default('1'),
    minimumRedemption: (0, pg_core_1.integer)('minimum_redemption').default(100),
    expiryDays: (0, pg_core_1.integer)('expiry_days'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.loyaltyTransactions = (0, pg_core_1.pgTable)('loyalty_transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    transactionType: (0, pg_core_1.varchar)('transaction_type', { length: 50 }).notNull(),
    pointsChange: (0, pg_core_1.integer)('points_change').notNull(),
    pointsBalance: (0, pg_core_1.integer)('points_balance').notNull(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 100 }),
    referenceType: (0, pg_core_1.varchar)('reference_type', { length: 50 }),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.reviews = (0, pg_core_1.pgTable)('reviews', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.orders.id),
    rating: (0, pg_core_1.integer)('rating').notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }),
    comment: (0, pg_core_1.text)('comment'),
    isVerified: (0, pg_core_1.boolean)('is_verified').default(false),
    isApproved: (0, pg_core_1.boolean)('is_approved').default(false),
    helpfulCount: (0, pg_core_1.integer)('helpful_count').default(0),
    images: (0, pg_core_1.jsonb)('images'),
    response: (0, pg_core_1.text)('response'),
    respondedAt: (0, pg_core_1.timestamp)('responded_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.wishlists = (0, pg_core_1.pgTable)('wishlists', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).default('My Wishlist'),
    isDefault: (0, pg_core_1.boolean)('is_default').default(true),
    isPublic: (0, pg_core_1.boolean)('is_public').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.wishlistItems = (0, pg_core_1.pgTable)('wishlist_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    wishlistId: (0, pg_core_1.integer)('wishlist_id').references(() => exports.wishlists.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    addedAt: (0, pg_core_1.timestamp)('added_at').defaultNow()
});
exports.cartItems = (0, pg_core_1.pgTable)('cart_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    addedAt: (0, pg_core_1.timestamp)('added_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.subscriptions = (0, pg_core_1.pgTable)('subscriptions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.integer)('customer_id').references(() => exports.customers.id).notNull(),
    planType: (0, pg_core_1.varchar)('plan_type', { length: 50 }).notNull(),
    mealType: (0, pg_core_1.varchar)('meal_type', { length: 50 }).notNull(),
    duration: (0, pg_core_1.integer)('duration').notNull(),
    startDate: (0, pg_core_1.date)('start_date').notNull(),
    endDate: (0, pg_core_1.date)('end_date').notNull(),
    deliveryTime: (0, pg_core_1.varchar)('delivery_time', { length: 100 }).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    metadata: (0, pg_core_1.jsonb)('metadata')
});
exports.subscriptionItems = (0, pg_core_1.pgTable)('subscription_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    subscriptionId: (0, pg_core_1.integer)('subscription_id').references(() => exports.subscriptions.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    dayOffset: (0, pg_core_1.integer)('day_offset').default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.analyticsEvents = (0, pg_core_1.pgTable)('analytics_events', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    eventName: (0, pg_core_1.varchar)('event_name', { length: 100 }).notNull(),
    eventCategory: (0, pg_core_1.varchar)('event_category', { length: 50 }).notNull(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    sessionId: (0, pg_core_1.varchar)('session_id', { length: 100 }),
    properties: (0, pg_core_1.jsonb)('properties'),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow()
});
exports.salesReports = (0, pg_core_1.pgTable)('sales_reports', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    reportDate: (0, pg_core_1.date)('report_date').notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    totalOrders: (0, pg_core_1.integer)('total_orders').default(0),
    totalRevenue: (0, pg_core_1.decimal)('total_revenue', { precision: 15, scale: 2 }).default('0'),
    totalCost: (0, pg_core_1.decimal)('total_cost', { precision: 15, scale: 2 }).default('0'),
    totalProfit: (0, pg_core_1.decimal)('total_profit', { precision: 15, scale: 2 }).default('0'),
    averageOrderValue: (0, pg_core_1.decimal)('average_order_value', { precision: 10, scale: 2 }).default('0'),
    newCustomers: (0, pg_core_1.integer)('new_customers').default(0),
    returningCustomers: (0, pg_core_1.integer)('returning_customers').default(0),
    topProducts: (0, pg_core_1.jsonb)('top_products'),
    topCategories: (0, pg_core_1.jsonb)('top_categories'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.employees = (0, pg_core_1.pgTable)('employees', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    employeeNumber: (0, pg_core_1.varchar)('employee_number', { length: 50 }).notNull().unique(),
    department: (0, pg_core_1.varchar)('department', { length: 100 }),
    position: (0, pg_core_1.varchar)('position', { length: 100 }),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    hireDate: (0, pg_core_1.date)('hire_date'),
    salary: (0, pg_core_1.decimal)('salary', { precision: 12, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    managerId: (0, pg_core_1.integer)('manager_id').references(() => exports.employees.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.attendance = (0, pg_core_1.pgTable)('attendance', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    employeeId: (0, pg_core_1.integer)('employee_id').references(() => exports.employees.id).notNull(),
    date: (0, pg_core_1.date)('date').notNull(),
    checkIn: (0, pg_core_1.timestamp)('check_in'),
    checkOut: (0, pg_core_1.timestamp)('check_out'),
    breakStart: (0, pg_core_1.timestamp)('break_start'),
    breakEnd: (0, pg_core_1.timestamp)('break_end'),
    totalHours: (0, pg_core_1.decimal)('total_hours', { precision: 4, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('present'),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.payroll = (0, pg_core_1.pgTable)('payroll', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    employeeId: (0, pg_core_1.integer)('employee_id').references(() => exports.employees.id).notNull(),
    payPeriodStart: (0, pg_core_1.date)('pay_period_start').notNull(),
    payPeriodEnd: (0, pg_core_1.date)('pay_period_end').notNull(),
    baseSalary: (0, pg_core_1.decimal)('base_salary', { precision: 12, scale: 2 }).notNull(),
    overtime: (0, pg_core_1.decimal)('overtime', { precision: 10, scale: 2 }).default('0'),
    bonus: (0, pg_core_1.decimal)('bonus', { precision: 10, scale: 2 }).default('0'),
    deductions: (0, pg_core_1.decimal)('deductions', { precision: 10, scale: 2 }).default('0'),
    tax: (0, pg_core_1.decimal)('tax', { precision: 10, scale: 2 }).default('0'),
    netPay: (0, pg_core_1.decimal)('net_pay', { precision: 12, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    paidDate: (0, pg_core_1.date)('paid_date'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.vendors = (0, pg_core_1.pgTable)('vendors', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    address: (0, pg_core_1.text)('address'),
    contactPerson: (0, pg_core_1.varchar)('contact_person', { length: 255 }),
    businessType: (0, pg_core_1.varchar)('business_type', { length: 100 }),
    commissionRate: (0, pg_core_1.decimal)('commission_rate', { precision: 5, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.vendorProducts = (0, pg_core_1.pgTable)('vendor_products', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    vendorId: (0, pg_core_1.integer)('vendor_id').references(() => exports.vendors.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    vendorPrice: (0, pg_core_1.decimal)('vendor_price', { precision: 10, scale: 2 }).notNull(),
    commissionAmount: (0, pg_core_1.decimal)('commission_amount', { precision: 10, scale: 2 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.vendorPayouts = (0, pg_core_1.pgTable)('vendor_payouts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    vendorId: (0, pg_core_1.integer)('vendor_id').references(() => exports.vendors.id).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 12, scale: 2 }).notNull(),
    period: (0, pg_core_1.varchar)('period', { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    paidDate: (0, pg_core_1.date)('paid_date'),
    reference: (0, pg_core_1.varchar)('reference', { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.financialTransactions = (0, pg_core_1.pgTable)('transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 15, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR'),
    description: (0, pg_core_1.text)('description'),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 100 }),
    referenceType: (0, pg_core_1.varchar)('reference_type', { length: 50 }),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.refunds = (0, pg_core_1.pgTable)('refunds', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    paymentId: (0, pg_core_1.integer)('payment_id').references(() => exports.payments.id).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    reason: (0, pg_core_1.text)('reason'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    processedDate: (0, pg_core_1.date)('processed_date'),
    refundReference: (0, pg_core_1.varchar)('refund_reference', { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.emailLogs = (0, pg_core_1.pgTable)('email_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    recipientEmail: (0, pg_core_1.varchar)('recipient_email', { length: 255 }).notNull(),
    subject: (0, pg_core_1.varchar)('subject', { length: 500 }),
    body: (0, pg_core_1.text)('body'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    sentAt: (0, pg_core_1.timestamp)('sent_at'),
    errorMessage: (0, pg_core_1.text)('error_message'),
    provider: (0, pg_core_1.varchar)('provider', { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.smsLogs = (0, pg_core_1.pgTable)('sms_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    recipientPhone: (0, pg_core_1.varchar)('recipient_phone', { length: 20 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    sentAt: (0, pg_core_1.timestamp)('sent_at'),
    errorMessage: (0, pg_core_1.text)('error_message'),
    provider: (0, pg_core_1.varchar)('provider', { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.notificationTemplates = (0, pg_core_1.pgTable)('notification_templates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull().unique(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    subject: (0, pg_core_1.varchar)('subject', { length: 500 }),
    body: (0, pg_core_1.text)('body').notNull(),
    variables: (0, pg_core_1.jsonb)('variables'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.notificationPreferences = (0, pg_core_1.pgTable)('notification_preferences', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    notificationType: (0, pg_core_1.varchar)('notification_type', { length: 50 }).notNull(),
    emailEnabled: (0, pg_core_1.boolean)('email_enabled').default(true),
    smsEnabled: (0, pg_core_1.boolean)('sms_enabled').default(true),
    pushEnabled: (0, pg_core_1.boolean)('push_enabled').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.configurations = (0, pg_core_1.pgTable)('configurations', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    key: (0, pg_core_1.varchar)('key', { length: 100 }).notNull().unique(),
    value: (0, pg_core_1.text)('value'),
    description: (0, pg_core_1.text)('description'),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).default('string'),
    isPublic: (0, pg_core_1.boolean)('is_public').default(false),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.apiKeys = (0, pg_core_1.pgTable)('api_keys', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    keyHash: (0, pg_core_1.varchar)('key_hash', { length: 255 }).notNull().unique(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    permissions: (0, pg_core_1.jsonb)('permissions'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    lastUsed: (0, pg_core_1.timestamp)('last_used'),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.rateLimits = (0, pg_core_1.pgTable)('rate_limits', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    identifier: (0, pg_core_1.varchar)('identifier', { length: 255 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    count: (0, pg_core_1.integer)('count').default(0),
    resetTime: (0, pg_core_1.timestamp)('reset_time').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.cacheEntries = (0, pg_core_1.pgTable)('cache_entries', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    key: (0, pg_core_1.varchar)('key', { length: 255 }).notNull().unique(),
    value: (0, pg_core_1.text)('value'),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.queueJobs = (0, pg_core_1.pgTable)('queue_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    queue: (0, pg_core_1.varchar)('queue', { length: 100 }).notNull(),
    payload: (0, pg_core_1.jsonb)('payload').notNull(),
    attempts: (0, pg_core_1.integer)('attempts').default(0),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    availableAt: (0, pg_core_1.timestamp)('available_at').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.systemLogs = (0, pg_core_1.pgTable)('system_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    level: (0, pg_core_1.varchar)('level', { length: 20 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    context: (0, pg_core_1.jsonb)('context'),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    sessionId: (0, pg_core_1.varchar)('session_id', { length: 100 }),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.errorLogs = (0, pg_core_1.pgTable)('error_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    errorCode: (0, pg_core_1.varchar)('error_code', { length: 50 }),
    errorMessage: (0, pg_core_1.text)('error_message').notNull(),
    stackTrace: (0, pg_core_1.text)('stack_trace'),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    requestPath: (0, pg_core_1.varchar)('request_path', { length: 500 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.performanceMetrics = (0, pg_core_1.pgTable)('performance_metrics', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    endpoint: (0, pg_core_1.varchar)('endpoint', { length: 255 }).notNull(),
    method: (0, pg_core_1.varchar)('method', { length: 10 }).notNull(),
    responseTime: (0, pg_core_1.integer)('response_time').notNull(),
    statusCode: (0, pg_core_1.integer)('status_code').notNull(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.expenses = (0, pg_core_1.pgTable)('expenses', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    vendor: (0, pg_core_1.varchar)('vendor', { length: 200 }),
    receiptNumber: (0, pg_core_1.varchar)('receipt_number', { length: 100 }),
    expenseDate: (0, pg_core_1.timestamp)('expense_date'),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.auditTransactions = (0, pg_core_1.pgTable)('audit_transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    amount: (0, pg_core_1.decimal)('amount', { precision: 10, scale: 2 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    reference: (0, pg_core_1.varchar)('reference', { length: 100 }),
    transactionDate: (0, pg_core_1.timestamp)('transaction_date'),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.labelMediaTypes = (0, pg_core_1.pgTable)('label_media_types', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    labelWidthMm: (0, pg_core_1.decimal)('label_width_mm', { precision: 6, scale: 2 }).notNull(),
    labelHeightMm: (0, pg_core_1.decimal)('label_height_mm', { precision: 6, scale: 2 }).notNull(),
    rows: (0, pg_core_1.integer)('rows').notNull().default(1),
    columns: (0, pg_core_1.integer)('columns').notNull().default(1),
    pageWidthMm: (0, pg_core_1.decimal)('page_width_mm', { precision: 6, scale: 2 }),
    pageHeightMm: (0, pg_core_1.decimal)('page_height_mm', { precision: 6, scale: 2 }),
    gapXMm: (0, pg_core_1.decimal)('gap_x_mm', { precision: 6, scale: 2 }).default('0'),
    gapYMm: (0, pg_core_1.decimal)('gap_y_mm', { precision: 6, scale: 2 }).default('0'),
    marginTopMm: (0, pg_core_1.decimal)('margin_top_mm', { precision: 6, scale: 2 }).default('0'),
    marginBottomMm: (0, pg_core_1.decimal)('margin_bottom_mm', { precision: 6, scale: 2 }).default('0'),
    marginLeftMm: (0, pg_core_1.decimal)('margin_left_mm', { precision: 6, scale: 2 }).default('0'),
    marginRightMm: (0, pg_core_1.decimal)('margin_right_mm', { precision: 6, scale: 2 }).default('0'),
    mediaType: (0, pg_core_1.varchar)('media_type', { length: 20 }).notNull().default('sheet'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.labelTemplates = (0, pg_core_1.pgTable)('label_templates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 200 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    mediaId: (0, pg_core_1.integer)('media_id').references(() => exports.labelMediaTypes.id).notNull(),
    templateJson: (0, pg_core_1.jsonb)('template_json').notNull(),
    previewImageUrl: (0, pg_core_1.varchar)('preview_image_url', { length: 500 }),
    version: (0, pg_core_1.integer)('version').notNull().default(1),
    industryStandard: (0, pg_core_1.varchar)('industry_standard', { length: 50 }),
    complianceVersion: (0, pg_core_1.varchar)('compliance_version', { length: 20 }),
    usageCount: (0, pg_core_1.integer)('usage_count').default(0),
    lastUsedAt: (0, pg_core_1.timestamp)('last_used_at'),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id).notNull(),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id),
    approvedBy: (0, pg_core_1.integer)('approved_by').references(() => exports.users.id),
    approvedAt: (0, pg_core_1.timestamp)('approved_at'),
    companyId: (0, pg_core_1.integer)('company_id').references(() => exports.companies.id),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    isPublic: (0, pg_core_1.boolean)('is_public').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
}, (table) => [
    (0, pg_core_1.unique)('unique_template_version').on(table.companyId, table.name, table.version),
    (0, pg_core_1.index)('idx_template_company_branch').on(table.companyId, table.branchId),
    (0, pg_core_1.index)('idx_template_type').on(table.type),
    (0, pg_core_1.index)('idx_template_active').on(table.isActive),
    (0, pg_core_1.index)('idx_template_compliance').on(table.industryStandard, table.complianceVersion)
]);
exports.labelPrintJobs = (0, pg_core_1.pgTable)('label_print_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    jobNumber: (0, pg_core_1.varchar)('job_number', { length: 50 }).notNull().unique(),
    templateId: (0, pg_core_1.integer)('template_id').references(() => exports.labelTemplates.id).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    mediaId: (0, pg_core_1.integer)('media_id').references(() => exports.labelMediaTypes.id).notNull(),
    printedBy: (0, pg_core_1.integer)('printed_by').references(() => exports.users.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    format: (0, pg_core_1.varchar)('format', { length: 10 }).notNull(),
    serialStart: (0, pg_core_1.varchar)('serial_start', { length: 50 }),
    serialEnd: (0, pg_core_1.varchar)('serial_end', { length: 50 }),
    batchId: (0, pg_core_1.varchar)('batch_id', { length: 100 }),
    expiryDate: (0, pg_core_1.date)('expiry_date'),
    printerName: (0, pg_core_1.varchar)('printer_name', { length: 100 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('completed'),
    errorMessage: (0, pg_core_1.text)('error_message'),
    fileUrl: (0, pg_core_1.varchar)('file_url', { length: 500 }),
    printedAt: (0, pg_core_1.timestamp)('printed_at').defaultNow(),
    metadata: (0, pg_core_1.jsonb)('metadata')
});
exports.labelPrintLogs = (0, pg_core_1.pgTable)('label_print_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    printJobId: (0, pg_core_1.integer)('print_job_id').references(() => exports.labelPrintJobs.id).notNull(),
    serialNumber: (0, pg_core_1.varchar)('serial_number', { length: 100 }).notNull(),
    productId: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    batchId: (0, pg_core_1.varchar)('batch_id', { length: 100 }),
    expiryDate: (0, pg_core_1.date)('expiry_date'),
    qrCode: (0, pg_core_1.text)('qr_code'),
    barcode: (0, pg_core_1.varchar)('barcode', { length: 100 }),
    imageUrl: (0, pg_core_1.varchar)('image_url', { length: 500 }),
    productData: (0, pg_core_1.jsonb)('product_data'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
}, (table) => ({
    uniqueSerial: (0, pg_core_1.unique)().on(table.serialNumber, table.branchId),
}));
exports.customTemplateDimensions = (0, pg_core_1.pgTable)('custom_template_dimensions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 200 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    paperSize: (0, pg_core_1.varchar)('paper_size', { length: 50 }).notNull(),
    paperWidth: (0, pg_core_1.decimal)('paper_width', { precision: 6, scale: 2 }).notNull(),
    paperHeight: (0, pg_core_1.decimal)('paper_height', { precision: 6, scale: 2 }).notNull(),
    labelWidth: (0, pg_core_1.decimal)('label_width', { precision: 6, scale: 2 }).notNull(),
    labelHeight: (0, pg_core_1.decimal)('label_height', { precision: 6, scale: 2 }).notNull(),
    horizontalCount: (0, pg_core_1.integer)('horizontal_count').notNull(),
    verticalCount: (0, pg_core_1.integer)('vertical_count').notNull(),
    marginTop: (0, pg_core_1.decimal)('margin_top', { precision: 6, scale: 2 }).notNull(),
    marginBottom: (0, pg_core_1.decimal)('margin_bottom', { precision: 6, scale: 2 }).notNull(),
    marginLeft: (0, pg_core_1.decimal)('margin_left', { precision: 6, scale: 2 }).notNull(),
    marginRight: (0, pg_core_1.decimal)('margin_right', { precision: 6, scale: 2 }).notNull(),
    horizontalGap: (0, pg_core_1.decimal)('horizontal_gap', { precision: 6, scale: 2 }).notNull(),
    verticalGap: (0, pg_core_1.decimal)('vertical_gap', { precision: 6, scale: 2 }).notNull(),
    cornerRadius: (0, pg_core_1.decimal)('corner_radius', { precision: 6, scale: 2 }).default('0'),
    templateType: (0, pg_core_1.varchar)('template_type', { length: 50 }).notNull(),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id).notNull(),
    companyId: (0, pg_core_1.integer)('company_id').references(() => exports.companies.id),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    isPublic: (0, pg_core_1.boolean)('is_public').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.labelPrintSettings = (0, pg_core_1.pgTable)('label_print_settings', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    branchId: (0, pg_core_1.integer)('branch_id').references(() => exports.branches.id).notNull(),
    defaultMediaId: (0, pg_core_1.integer)('default_media_id').references(() => exports.labelMediaTypes.id),
    printerName: (0, pg_core_1.varchar)('printer_name', { length: 100 }),
    printerIp: (0, pg_core_1.varchar)('printer_ip', { length: 45 }),
    serialPrefix: (0, pg_core_1.varchar)('serial_prefix', { length: 20 }),
    serialCounter: (0, pg_core_1.integer)('serial_counter').default(1),
    expiryDaysDefault: (0, pg_core_1.integer)('expiry_days_default').default(365),
    qrBaseUrl: (0, pg_core_1.varchar)('qr_base_url', { length: 200 }),
    companyLogo: (0, pg_core_1.varchar)('company_logo', { length: 500 }),
    fssaiLicense: (0, pg_core_1.varchar)('fssai_license', { length: 100 }),
    fssaiLogoUrl: (0, pg_core_1.varchar)('fssai_logo_url', { length: 500 }),
    settings: (0, pg_core_1.jsonb)('settings'),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
}, (table) => ({
    uniqueBranch: (0, pg_core_1.unique)().on(table.branchId),
}));
exports.webhooks = (0, pg_core_1.pgTable)('webhooks', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    url: (0, pg_core_1.varchar)('url', { length: 500 }).notNull(),
    events: (0, pg_core_1.jsonb)('events').notNull(),
    secret: (0, pg_core_1.varchar)('secret', { length: 255 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.webhookDeliveries = (0, pg_core_1.pgTable)('webhook_deliveries', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    webhookId: (0, pg_core_1.integer)('webhook_id').references(() => exports.webhooks.id).notNull(),
    event: (0, pg_core_1.varchar)('event', { length: 100 }).notNull(),
    payload: (0, pg_core_1.jsonb)('payload').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('pending'),
    attempts: (0, pg_core_1.integer)('attempts').default(0),
    lastAttempt: (0, pg_core_1.timestamp)('last_attempt'),
    response: (0, pg_core_1.text)('response'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.traditionalItems = (0, pg_core_1.pgTable)('traditional_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nameEnglish: (0, pg_core_1.varchar)('name_english', { length: 255 }).notNull(),
    nameTelugu: (0, pg_core_1.varchar)('name_telugu', { length: 255 }).notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 100 }).notNull(),
    unit: (0, pg_core_1.varchar)('unit', { length: 50 }).notNull(),
    ordinaryPrice: (0, pg_core_1.decimal)('ordinary_price', { precision: 10, scale: 2 }).notNull(),
    mediumPrice: (0, pg_core_1.decimal)('medium_price', { precision: 10, scale: 2 }).notNull(),
    bestPrice: (0, pg_core_1.decimal)('best_price', { precision: 10, scale: 2 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    region: (0, pg_core_1.varchar)('region', { length: 100 }).default('AP_TG'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.branchTraditionalItems = (0, pg_core_1.pgTable)('branch_traditional_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    branchId: (0, pg_core_1.integer)('branch_id').notNull(),
    itemName: (0, pg_core_1.varchar)('item_name', { length: 255 }).notNull(),
    itemNameTelugu: (0, pg_core_1.varchar)('item_name_telugu', { length: 255 }),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    categoryTelugu: (0, pg_core_1.varchar)('category_telugu', { length: 100 }),
    unit: (0, pg_core_1.varchar)('unit', { length: 50 }).default('kg'),
    basePrice: (0, pg_core_1.decimal)('base_price', { precision: 10, scale: 2 }).default('0.00'),
    qualityTier: (0, pg_core_1.varchar)('quality_tier', { length: 20 }).default('medium'),
    availabilityStatus: (0, pg_core_1.varchar)('availability_status', { length: 50 }).default('available'),
    seasonal: (0, pg_core_1.boolean)('seasonal').default(false),
    region: (0, pg_core_1.varchar)('region', { length: 50 }).default('AP_TG'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.traditionalOrders = (0, pg_core_1.pgTable)('traditional_orders', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    customerId: (0, pg_core_1.varchar)('customer_id').references(() => exports.users.id),
    orderType: (0, pg_core_1.varchar)('order_type', { length: 50 }).default('traditional'),
    qualityTier: (0, pg_core_1.varchar)('quality_tier', { length: 20 }).notNull(),
    totalAmount: (0, pg_core_1.decimal)('total_amount', { precision: 10, scale: 2 }).notNull(),
    selectedVendorId: (0, pg_core_1.integer)('selected_vendor_id').references(() => exports.vendors.id),
    deliveryAddress: (0, pg_core_1.text)('delivery_address').notNull(),
    orderStatus: (0, pg_core_1.varchar)('order_status', { length: 50 }).default('pending'),
    orderDate: (0, pg_core_1.timestamp)('order_date').defaultNow(),
    deliveryDate: (0, pg_core_1.timestamp)('delivery_date'),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.traditionalOrderItems = (0, pg_core_1.pgTable)('traditional_order_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    orderId: (0, pg_core_1.integer)('order_id').references(() => exports.traditionalOrders.id),
    itemId: (0, pg_core_1.integer)('item_id').references(() => exports.traditionalItems.id),
    quantity: (0, pg_core_1.decimal)('quantity', { precision: 10, scale: 2 }).notNull(),
    unitPrice: (0, pg_core_1.decimal)('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
exports.contentItems = (0, pg_core_1.pgTable)('content_items', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    content: (0, pg_core_1.text)('content'),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('draft'),
    publishedAt: (0, pg_core_1.timestamp)('published_at'),
    metaDescription: (0, pg_core_1.text)('meta_description'),
    tags: (0, pg_core_1.jsonb)('tags'),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.categories.id),
    createdBy: (0, pg_core_1.varchar)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.pages = (0, pg_core_1.pgTable)('pages', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).unique().notNull(),
    content: (0, pg_core_1.text)('content'),
    metaTitle: (0, pg_core_1.varchar)('meta_title', { length: 255 }),
    metaDescription: (0, pg_core_1.text)('meta_description'),
    metaKeywords: (0, pg_core_1.text)('meta_keywords'),
    isPublished: (0, pg_core_1.boolean)('is_published').default(false),
    publishedAt: (0, pg_core_1.timestamp)('published_at'),
    createdBy: (0, pg_core_1.varchar)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.labelTemplatesRelations = (0, drizzle_orm_1.relations)(exports.labelTemplates, ({ one, many }) => ({
    company: one(exports.companies, { fields: [exports.labelTemplates.companyId], references: [exports.companies.id] }),
    branch: one(exports.branches, { fields: [exports.labelTemplates.branchId], references: [exports.branches.id] }),
    mediaType: one(exports.mediaTypes, { fields: [exports.labelTemplates.mediaId], references: [exports.mediaTypes.id] }),
    createdByUser: one(exports.users, { fields: [exports.labelTemplates.createdBy], references: [exports.users.id] }),
    updatedByUser: one(exports.users, { fields: [exports.labelTemplates.updatedBy], references: [exports.users.id] }),
    approvedByUser: one(exports.users, { fields: [exports.labelTemplates.approvedBy], references: [exports.users.id] }),
    qrCodes: many(exports.qrCodeAuditLog),
    designJobs: many(exports.labelDesignJobs),
}));
exports.mediaTypesRelations = (0, drizzle_orm_1.relations)(exports.mediaTypes, ({ many }) => ({
    templates: many(exports.labelTemplates),
    designJobs: many(exports.labelDesignJobs),
}));
exports.qrCodeAuditLogRelations = (0, drizzle_orm_1.relations)(exports.qrCodeAuditLog, ({ one }) => ({
    template: one(exports.labelTemplates, { fields: [exports.qrCodeAuditLog.templateId], references: [exports.labelTemplates.id] }),
    generatedByUser: one(exports.users, { fields: [exports.qrCodeAuditLog.generatedBy], references: [exports.users.id] }),
    company: one(exports.companies, { fields: [exports.qrCodeAuditLog.companyId], references: [exports.companies.id] }),
    branch: one(exports.branches, { fields: [exports.qrCodeAuditLog.branchId], references: [exports.branches.id] }),
}));
exports.labelDesignJobsRelations = (0, drizzle_orm_1.relations)(exports.labelDesignJobs, ({ one }) => ({
    template: one(exports.labelTemplates, { fields: [exports.labelDesignJobs.templateId], references: [exports.labelTemplates.id] }),
    mediaType: one(exports.mediaTypes, { fields: [exports.labelDesignJobs.mediaTypeId], references: [exports.mediaTypes.id] }),
    createdByUser: one(exports.users, { fields: [exports.labelDesignJobs.createdBy], references: [exports.users.id] }),
    processedByUser: one(exports.users, { fields: [exports.labelDesignJobs.processedBy], references: [exports.users.id] }),
    company: one(exports.companies, { fields: [exports.labelDesignJobs.companyId], references: [exports.companies.id] }),
    branch: one(exports.branches, { fields: [exports.labelDesignJobs.branchId], references: [exports.branches.id] }),
}));
//# sourceMappingURL=schema.js.map