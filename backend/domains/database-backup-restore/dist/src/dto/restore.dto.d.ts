export declare enum RestoreType {
    FULL = "full",
    SCHEMA_ONLY = "schema_only",
    DATA_ONLY = "data_only",
    CUSTOM = "custom"
}
export declare class CreateRestoreDto {
    backupId: number;
    restoreType?: RestoreType;
    customTables?: string[];
    dropExisting?: boolean;
}
export declare class RestoreStatusDto {
    limit?: number;
    status?: string;
}
