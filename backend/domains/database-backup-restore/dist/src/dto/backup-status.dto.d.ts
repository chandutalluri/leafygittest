export declare class BackupStatusDto {
    status?: string;
    limit?: number;
}
export declare class CreateScheduleDto {
    name: string;
    cronExpression: string;
    backupType?: string;
}
export declare class UpdateScheduleDto {
    name?: string;
    cronExpression?: string;
    backupType?: string;
    isActive?: boolean;
}
