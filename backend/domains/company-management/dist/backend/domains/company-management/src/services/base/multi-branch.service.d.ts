export declare abstract class MultiBranchService<T> {
    protected abstract readonly tableName: string;
    protected abstract readonly table: any;
    findAllByBranch(branchId: number): Promise<T[]>;
    findOneByBranch(id: string | number, branchId: number): Promise<T>;
    createWithBranch(data: any, branchId: number): Promise<T>;
    updateByBranch(id: string | number, data: any, branchId: number): Promise<T>;
    deleteByBranch(id: string | number, branchId: number): Promise<void>;
    countByBranch(branchId: number): Promise<number>;
    existsInBranch(id: string | number, branchId: number): Promise<boolean>;
    findPaginatedByBranch(branchId: number, page?: number, limit?: number): Promise<{
        data: T[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
