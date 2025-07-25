import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../../../../shared/schema';

@Injectable()
export class DatabaseService {
  private db: ReturnType<typeof drizzle>;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(this.pool, { schema });
  }

  getDatabase() {
    return this.db;
  }

  async closeConnection() {
    await this.pool.end();
  }
}