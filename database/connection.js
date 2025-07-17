/**
 * Environment-agnostic Database Connection Manager
 * Works with any PostgreSQL deployment (local, cloud, Docker, Kubernetes)
 */

const { Pool } = require('pg');
const { getDatabaseConfig, getPoolConfig } = require('./config');

class DatabaseConnection {
  constructor(serviceName = 'default') {
    this.serviceName = serviceName;
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return this.pool;

    try {
      const config = getDatabaseConfig();
      const poolConfig = getPoolConfig(this.serviceName);
      
      this.pool = new Pool({
        ...config.connection,
        ...poolConfig,
        // Connection retry logic
        connectionTimeoutMillis: 10000,
        query_timeout: 30000,
        statement_timeout: 30000,
        idle_in_transaction_session_timeout: 60000,
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isConnected = true;
      console.log(`✅ Database connected for service: ${this.serviceName}`);
      
      // Handle pool events
      this.pool.on('error', (err) => {
        console.error(`Database pool error in ${this.serviceName}:`, err);
        this.isConnected = false;
      });

      this.pool.on('connect', () => {
        console.log(`New client connected in ${this.serviceName} pool`);
      });

      return this.pool;
    } catch (error) {
      console.error(`Failed to connect to database for ${this.serviceName}:`, error.message);
      throw error;
    }
  }

  async query(text, params) {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        console.warn(`Slow query in ${this.serviceName} (${duration}ms):`, text.substring(0, 100));
      }
      
      return result;
    } catch (error) {
      console.error(`Query error in ${this.serviceName}:`, error.message);
      throw error;
    }
  }

  async transaction(callback) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log(`Database disconnected for service: ${this.serviceName}`);
    }
  }

  // Health check
  async isHealthy() {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows[0].health === 1;
    } catch (error) {
      return false;
    }
  }
}

// Singleton factory for service connections
class DatabaseManager {
  static instances = new Map();

  static getConnection(serviceName = 'default') {
    if (!this.instances.has(serviceName)) {
      this.instances.set(serviceName, new DatabaseConnection(serviceName));
    }
    return this.instances.get(serviceName);
  }

  static async closeAll() {
    for (const [name, connection] of this.instances) {
      await connection.disconnect();
    }
    this.instances.clear();
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database connections...');
  await DatabaseManager.closeAll();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing database connections...');
  await DatabaseManager.closeAll();
  process.exit(0);
});

module.exports = {
  DatabaseConnection,
  DatabaseManager,
  getConnection: (serviceName) => DatabaseManager.getConnection(serviceName),
};