export declare enum BackupType {
    FULL = "full",
    SCHEMA_ONLY = "schema_only",
    DATA_ONLY = "data_only",
    CUSTOM = "custom"
}
export declare class CreateScheduleDto {
    name: string;
    cronExpression: string;
    backupType?: BackupType;
    retentionDays?: number;
    isActive?: boolean;
    customTables?: string[];
}
export declare class UpdateScheduleDto {
    name?: string;
    cronExpression?: string;
    backupType?: BackupType;
    retentionDays?: number;
    isActive?: boolean;
    customTables?: string[];
}
export declare class ScheduleStatusDto {
    limit?: number;
    active?: boolean;
}
