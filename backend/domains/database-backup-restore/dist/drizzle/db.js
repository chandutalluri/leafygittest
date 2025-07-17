"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryClient = exports.db = void 0;
exports.closeDatabase = closeDatabase;
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema = require("./schema");
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
    min: 0,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    ssl: process.env.DATABASE_SSL === 'false' ? false :
        process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
pool.on('error', (err) => {
    console.error('[database-backup-restore] Pool error occurred:', err.message);
});
pool.on('connect', (client) => {
    console.log('[database-backup-restore] New client connected to database');
});
pool.on('remove', (client) => {
    console.log('[database-backup-restore] Client removed from pool');
});
exports.db = (0, node_postgres_1.drizzle)(pool, { schema });
exports.queryClient = pool;
async function closeDatabase() {
    try {
        await pool.end();
        console.log('[database-backup-restore] Database pool closed');
    }
    catch (error) {
        console.error('[database-backup-restore] Error closing database pool:', error);
    }
}
//# sourceMappingURL=db.js.map