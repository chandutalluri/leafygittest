"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiBranchService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../../database/connection");
let MultiBranchService = class MultiBranchService {
    async findAllByBranch(branchId) {
        return await connection_1.db
            .select()
            .from(this.table)
            .where((0, drizzle_orm_1.eq)(this.table.branchId, branchId));
    }
    async findOneByBranch(id, branchId) {
        const [record] = await connection_1.db
            .select()
            .from(this.table)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(this.table.id, id), (0, drizzle_orm_1.eq)(this.table.branchId, branchId)))
            .limit(1);
        if (!record) {
            throw new common_1.NotFoundException(`${this.tableName} with ID ${id} not found in branch ${branchId}`);
        }
        return record;
    }
    async createWithBranch(data, branchId) {
        const created = await connection_1.db
            .insert(this.table)
            .values({
            ...data,
            branchId,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
            .returning();
        return created[0];
    }
    async updateByBranch(id, data, branchId) {
        const [updated] = await connection_1.db
            .update(this.table)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(this.table.id, id), (0, drizzle_orm_1.eq)(this.table.branchId, branchId)))
            .returning();
        if (!updated) {
            throw new common_1.NotFoundException(`${this.tableName} with ID ${id} not found in branch ${branchId}`);
        }
        return updated;
    }
    async deleteByBranch(id, branchId) {
        const result = await connection_1.db
            .delete(this.table)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(this.table.id, id), (0, drizzle_orm_1.eq)(this.table.branchId, branchId)));
        if (!result.rowCount) {
            throw new common_1.NotFoundException(`${this.tableName} with ID ${id} not found in branch ${branchId}`);
        }
    }
    async countByBranch(branchId) {
        const [result] = await connection_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(this.table)
            .where((0, drizzle_orm_1.eq)(this.table.branchId, branchId));
        return Number(result.count);
    }
    async existsInBranch(id, branchId) {
        const [result] = await connection_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(this.table)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(this.table.id, id), (0, drizzle_orm_1.eq)(this.table.branchId, branchId)))
            .limit(1);
        return Number(result.count) > 0;
    }
    async findPaginatedByBranch(branchId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [data, totalResult] = await Promise.all([
            connection_1.db
                .select()
                .from(this.table)
                .where((0, drizzle_orm_1.eq)(this.table.branchId, branchId))
                .limit(limit)
                .offset(offset),
            connection_1.db
                .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(this.table)
                .where((0, drizzle_orm_1.eq)(this.table.branchId, branchId)),
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
};
exports.MultiBranchService = MultiBranchService;
exports.MultiBranchService = MultiBranchService = __decorate([
    (0, common_1.Injectable)()
], MultiBranchService);
//# sourceMappingURL=multi-branch.service.js.map