
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../drizzle/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/leafyhealth',
});

export const db = drizzle(pool, { schema });

// Export specific tables for easier imports
export const {
  image_management_images: images,
  image_management_albums: albums,
  image_management_metadata: metadata,
  image_management_transformations: transformations
} = schema;

// Types for the service
export type ImageRecord = typeof images.$inferSelect;
export type NewImageRecord = typeof images.$inferInsert;
export type AlbumRecord = typeof albums.$inferSelect;
export type NewAlbumRecord = typeof albums.$inferInsert;

// Connection health check
export async function checkConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection() {
  await pool.end();
}
