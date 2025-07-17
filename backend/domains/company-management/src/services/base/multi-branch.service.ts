import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../database/connection';

/**
 * Base service for all multi-branch aware services
 * This ensures all operations are automatically filtered by branch
 */
@Injectable()
export abstract class MultiBranchService<T> {
  protected abstract readonly tableName: string;
  protected abstract readonly table: any;

  /**
   * Find all records for a specific branch
   */
  async findAllByBranch(branchId: number): Promise<T[]> {
    return await db
      .select()
      .from(this.table)
      .where(eq(this.table.branchId, branchId));
  }

  /**
   * Find a single record by ID and branch
   */
  async findOneByBranch(id: string | number, branchId: number): Promise<T> {
    const [record] = await db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.id, id),
          eq(this.table.branchId, branchId)
        )
      )
      .limit(1);

    if (!record) {
      throw new NotFoundException(
        `${this.tableName} with ID ${id} not found in branch ${branchId}`
      );
    }

    return record;
  }

  /**
   * Create a new record with automatic branch assignment
   */
  async createWithBranch(data: any, branchId: number): Promise<T> {
    const created = await db
      .insert(this.table)
      .values({
        ...data,
        branchId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return created[0] as T;
  }

  /**
   * Update a record ensuring branch context
   */
  async updateByBranch(id: string | number, data: any, branchId: number): Promise<T> {
    const [updated] = await db
      .update(this.table)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(this.table.id, id),
          eq(this.table.branchId, branchId)
        )
      )
      .returning();

    if (!updated) {
      throw new NotFoundException(
        `${this.tableName} with ID ${id} not found in branch ${branchId}`
      );
    }

    return updated;
  }

  /**
   * Delete a record ensuring branch context
   */
  async deleteByBranch(id: string | number, branchId: number): Promise<void> {
    const result = await db
      .delete(this.table)
      .where(
        and(
          eq(this.table.id, id),
          eq(this.table.branchId, branchId)
        )
      );

    if (!result.rowCount) {
      throw new NotFoundException(
        `${this.tableName} with ID ${id} not found in branch ${branchId}`
      );
    }
  }

  /**
   * Count records for a specific branch
   */
  async countByBranch(branchId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(this.table)
      .where(eq(this.table.branchId, branchId));

    return Number(result.count);
  }

  /**
   * Check if a record exists in a specific branch
   */
  async existsInBranch(id: string | number, branchId: number): Promise<boolean> {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(this.table)
      .where(
        and(
          eq(this.table.id, id),
          eq(this.table.branchId, branchId)
        )
      )
      .limit(1);

    return Number(result.count) > 0;
  }

  /**
   * Find records with pagination for a specific branch
   */
  async findPaginatedByBranch(
    branchId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(this.table)
        .where(eq(this.table.branchId, branchId))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql`count(*)` })
        .from(this.table)
        .where(eq(this.table.branchId, branchId)),
    ]);

    const total = Number(totalResult[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      totalPages,
    };
  }
}