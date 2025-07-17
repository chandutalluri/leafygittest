/**
 * LeafyHealth Database Configuration
 * Professional, environment-agnostic database configuration
 * Supports any PostgreSQL deployment (local, cloud, containerized)
 */

// Parse database connection string
function parseConnectionString(url) {
  if (!url) return null;
  
  try {
    const dbUrl = new URL(url);
    return {
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 5432,
      database: dbUrl.pathname.slice(1),
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      ssl: dbUrl.searchParams.get('sslmode') !== 'disable' 
        ? { rejectUnauthorized: false } 
        : undefined
    };
  } catch (error) {
    return null;
  }
}

// Get database configuration
function getDatabaseConfig() {
  const env = process.env.NODE_ENV || 'development';
  
  // Use DATABASE_URL if available (works with any PostgreSQL provider)
  if (process.env.DATABASE_URL) {
    const parsed = parseConnectionString(process.env.DATABASE_URL);
    if (parsed) {
      return {
        client: 'pg',
        connection: parsed,
        pool: {
          min: env === 'production' ? 2 : 1,
          max: env === 'production' ? 25 : 10,
          idleTimeoutMillis: 30000,
          createRetryIntervalMillis: 200,
        }
      };
    }
  }
  
  // Fallback to individual environment variables
  return {
    client: 'pg',
    connection: {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE || 'leafyhealth',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      ssl: process.env.DATABASE_SSL === 'true' 
        ? { rejectUnauthorized: false } 
        : undefined
    },
    pool: {
      min: env === 'production' ? 2 : 1,
      max: env === 'production' ? 25 : 10,
      idleTimeoutMillis: 30000,
      createRetryIntervalMillis: 200,
    }
  };
}

// Connection pool configuration for microservices
function getPoolConfig(serviceName = 'default') {
  const baseConfig = {
    min: 1,
    max: 3, // Conservative for 27 microservices
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  };
  
  // Service-specific configurations
  const serviceConfigs = {
    'authentication': { max: 5 }, // Higher for auth service
    'direct-data-gateway': { max: 5 }, // Higher for data gateway
    'order-management': { max: 4 },
    'payment-processing': { max: 4 },
    'default': baseConfig
  };
  
  return { ...baseConfig, ...(serviceConfigs[serviceName] || serviceConfigs.default) };
}

// Validate database configuration
function validateConfig() {
  const config = getDatabaseConfig();
  const required = ['host', 'port', 'database', 'user'];
  
  for (const field of required) {
    if (!config.connection[field]) {
      throw new Error(`Missing required database configuration: ${field}`);
    }
  }
  
  return true;
}

// Export configuration
module.exports = {
  getDatabaseConfig,
  getPoolConfig,
  parseConnectionString,
  validateConfig,
  
  // Direct access to config
  get config() {
    return getDatabaseConfig();
  },
  
  // Connection string builder
  buildConnectionString: (config) => {
    const { host, port, database, user, password, ssl } = config;
    const auth = password ? `${user}:${encodeURIComponent(password)}` : user;
    const sslParam = ssl ? '?sslmode=require' : '';
    return `postgresql://${auth}@${host}:${port}/${database}${sslParam}`;
  }
};