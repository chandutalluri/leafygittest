import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create PostgreSQL pool with enhanced stability settings
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 2, // Minimal pool size for microservice
  min: 0, // Allow zero connections when idle
  idleTimeoutMillis: 10000, // Shorter idle timeout
  connectionTimeoutMillis: 5000, // Shorter connection timeout
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  ssl: process.env.DATABASE_SSL === 'false' ? false : 
       process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Enhanced error handling with reconnection logic
pool.on('error', (err) => {
  console.error('[database-backup-restore] Pool error occurred:', err.message);
  // Log but don't crash - pool will handle reconnection automatically
});

pool.on('connect', (client) => {
  console.log('[database-backup-restore] New client connected to database');
});

pool.on('remove', (client) => {
  console.log('[database-backup-restore] Client removed from pool');
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

// Export pool as queryClient for compatibility with existing code
export const queryClient = pool;

// Cleanup function for graceful shutdown
export async function closeDatabase() {
  try {
    await pool.end();
    console.log('[database-backup-restore] Database pool closed');
  } catch (error) {
    console.error('[database-backup-restore] Error closing database pool:', error);
  }
}