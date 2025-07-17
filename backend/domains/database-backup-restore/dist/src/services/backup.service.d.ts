import { GCSService } from './gcs.service';
export declare class BackupService {
    private readonly gcsService;
    private readonly logger;
    private readonly localBackupDir;
    constructor(gcsService: GCSService);
    private ensureBackupDirectory;
    createBackup(type: string, createdBy: string): Promise<string>;
    getBackupJobs(limit?: number): Promise<any[]>;
    getBackupJob(jobId: string): Promise<any>;
    deleteBackup(jobId: string): Promise<void>;
    private generateJobId;
    private calculateChecksum;
    private formatBytes;
    getBackupStats(): Promise<any>;
}
