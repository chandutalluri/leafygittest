import { Pool } from 'pg';
import * as schema from './schema';
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
export declare const queryClient: Pool;
export declare function closeDatabase(): Promise<void>;
