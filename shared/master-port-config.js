/**
 * MASTER PORT CONFIGURATION - SINGLE SOURCE OF TRUTH
 * All services, gateways, and applications must use this configuration
 * NO DUPLICATES - NO CONFLICTS - FINAL ALLOCATION
 */

// Frontend Applications (Ports 3000-3004)
const FRONTEND_PORTS = {
  'ecommerce-web': 3000,      // Customer ecommerce web
  'ecommerce-mobile': 3001,   // Customer ecommerce mobile
  'admin-portal': 3002,       // Admin dashboard
  'super-admin': 3003,        // Super admin dashboard
  'ops-delivery': 3004        // Operations dashboard
};

// Backend Microservices (Ports 3010-3050) - CONFLICT-FREE ALLOCATION
const SERVICE_PORTS = {
  // Core Services (3010-3019)
  'identity-access': 3010,
  'user-role-management': 3011,
  'company-management': 3013,
  'accounting-management': 3014,
  'analytics-reporting': 3015,
  'compliance-audit': 3016,
  'content-management': 3017,
  'integration-hub': 3018,
  'multi-language-management': 3019,

  // Business Services (3020-3029)
  'expense-monitoring': 3021,
  'catalog-management': 3022,
  'order-management': 3023,
  'customer-service': 3024,
  'inventory-management': 3025,
  'payment-processing': 3026,
  'label-design': 3027,
  'employee-management': 3028,
  'performance-monitor': 3029,

  // Extended Services (3030-3039)
  'notification-service': 3031,
  'reporting-management': 3032,
  'marketplace-management': 3033,
  'shipping-delivery': 3034,
  'image-management': 3035,
  'subscription-management': 3036,
  'backup-restore': 3037,
  'database-backup-restore': 3045,

  // Special Services (3040-3050)
  'product-orchestrator': 3042,
  'traditional-orders': 3050
};

// Gateway and Auth Services
const SPECIAL_PORTS = {
  'gateway': 5000,
  'auth': 8085,
  'direct-data': 8081
};

// All 29 Backend Services List for Validation
const ALL_BACKEND_SERVICES = [
  'identity-access',
  'user-role-management', 
  'company-management',
  'accounting-management',
  'analytics-reporting',
  'compliance-audit',
  'content-management',
  'integration-hub',
  'multi-language-management',
  'expense-monitoring',
  'catalog-management',
  'order-management',
  'customer-service',
  'inventory-management',
  'payment-processing',
  'label-design',
  'employee-management',
  'performance-monitor',
  'notification-service',
  'reporting-management',
  'marketplace-management',
  'shipping-delivery',
  'image-management',
  'subscription-management',
  'backup-restore',
  'database-backup-restore',
  'product-orchestrator',
  'traditional-orders'
];

/**
 * Get port number for a frontend application
 */
function getFrontendPort(appName) {
  const port = FRONTEND_PORTS[appName];
  if (!port) {
    throw new Error(`No port configured for frontend app: ${appName}`);
  }
  return parseInt(port);
}

/**
 * Get port number for a backend service
 */
function getBackendPort(serviceName) {
  const port = SERVICE_PORTS[serviceName];
  if (!port) {
    throw new Error(`No port configured for service: ${serviceName}`);
  }
  return parseInt(port);
}

/**
 * Get all service configurations
 */
function getAllServices() {
  return SERVICE_PORTS;
}

/**
 * Get all frontend configurations
 */
function getAllFrontendApps() {
  return FRONTEND_PORTS;
}

/**
 * Validate port configuration (no conflicts)
 */
function validatePortConfiguration() {
  const allPorts = [
    ...Object.values(FRONTEND_PORTS),
    ...Object.values(SERVICE_PORTS),
    ...Object.values(SPECIAL_PORTS)
  ];
  
  const uniquePorts = new Set(allPorts);
  
  if (allPorts.length !== uniquePorts.size) {
    throw new Error('PORT CONFLICT DETECTED - Duplicate ports found');
  }
  
  return true;
}

/**
 * Check if a port is allocated to a service
 */
function getServiceByPort(port) {
  for (const [serviceName, servicePort] of Object.entries(SERVICE_PORTS)) {
    if (servicePort === port) {
      return serviceName;
    }
  }
  return null;
}

// Validate configuration on load
validatePortConfiguration();

module.exports = {
  getFrontendPort,
  getBackendPort,
  getAllServices,
  getAllFrontendApps,
  getServiceByPort,
  validatePortConfiguration,
  FRONTEND_PORTS,
  SERVICE_PORTS,
  SPECIAL_PORTS,
  ALL_BACKEND_SERVICES
};