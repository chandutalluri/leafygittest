export declare class SafeBackupService {
    private readonly logger;
    private readonly backupDir;
    constructor();
    private ensureBackupDir;
    createSafeBackup(): Promise<{
        success: boolean;
        message: string;
        metadata?: any;
    }>;
    listBackups(): Promise<any[]>;
    deleteBackup(fileName: string): Promise<boolean>;
}
