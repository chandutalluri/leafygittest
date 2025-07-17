export declare class RestoreService {
    private pool;
    constructor();
    startRestore(backupId: number, restoreType?: string, createdBy?: string): Promise<string>;
    private performRestore;
    private executeRestore;
    private buildRestoreCommand;
    private updateRestoreJobStatus;
    getRestoreJob(jobId: string): Promise<any>;
    getRestoreJobs(limit?: number): Promise<any[]>;
}
