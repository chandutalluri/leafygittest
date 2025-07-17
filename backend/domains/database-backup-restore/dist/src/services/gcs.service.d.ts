export declare class GCSService {
    private readonly logger;
    private bucketName;
    constructor();
    uploadBackup(localPath: string, gcsPath: string): Promise<string>;
    isConfigured(): Promise<boolean>;
    downloadBackup(gcsPath: string, localPath: string): Promise<void>;
    deleteBackup(gcsPath: string): Promise<void>;
    listBackups(): Promise<any[]>;
    cleanupOldBackups(retentionDays?: number): Promise<number>;
}
