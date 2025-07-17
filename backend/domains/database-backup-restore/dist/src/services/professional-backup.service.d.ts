export declare class ProfessionalBackupService {
    private readonly logger;
    private readonly backupDir;
    constructor();
    private ensureBackupDirectory;
    createProfessionalBackup(type?: 'logical' | 'custom'): Promise<{
        success: boolean;
        message: string;
        metadata: {
            fileName: string;
            filePath: string;
            fileSize: string;
            checksum: string;
            type: "custom" | "logical";
            tableCount: number;
            duration: string;
            createdAt: string;
            databaseUrl: string;
            host: string;
            method: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        metadata?: undefined;
    }>;
    listBackups(): Promise<{
        success: boolean;
        backups: any[];
        count: number;
        error?: undefined;
    } | {
        success: boolean;
        backups: any[];
        error: any;
        count?: undefined;
    }>;
    getBackupFile(fileName: string): Promise<{
        success: boolean;
        filePath: string;
        fileName: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        filePath?: undefined;
        fileName?: undefined;
    }>;
    restoreProfessionalBackup(fileName: string): Promise<{
        success: boolean;
        fileName: string;
        duration: string;
        restoredAt: string;
        warnings: string;
    } | {
        success: boolean;
        error: any;
    }>;
    cleanupOldBackups(daysToKeep?: number): Promise<{
        success: boolean;
        deletedCount: number;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        deletedCount?: undefined;
        message?: undefined;
    }>;
}
