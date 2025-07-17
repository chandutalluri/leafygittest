export declare class QuickBackupService {
    private readonly logger;
    private readonly backupDir;
    constructor();
    private ensureBackupDir;
    createQuickBackup(): Promise<{
        success: boolean;
        message: string;
        file?: string;
    }>;
    createJsonExport(): Promise<{
        success: boolean;
        message: string;
        file?: string;
    }>;
    private formatBytes;
}
