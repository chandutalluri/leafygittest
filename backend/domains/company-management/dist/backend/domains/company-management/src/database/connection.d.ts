import { Pool } from 'pg';
import * as entitySchema from "../entities/company-management.entity";
export declare const pool: Pool;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof entitySchema> & {
    $client: Pool;
};
