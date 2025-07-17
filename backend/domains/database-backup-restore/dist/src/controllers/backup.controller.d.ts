import { Response } from 'express';
import { BackupService } from '../services/backup.service';
import { SchedulerService } from '../services/scheduler.service';
import { QuickBackupService } from '../services/quick-backup.service';
import { SafeBackupService } from '../services/safe-backup.service';
import { ProfessionalBackupService } from '../services/professional-backup.service';
import { CreateBackupDto } from '../dto/create-backup.dto';
import { BackupStatusDto } from '../dto/backup-status.dto';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';
export declare class BackupController {
    private readonly backupService;
    private readonly schedulerService;
    private readonly quickBackupService;
    private readonly safeBackupService;
    private readonly professionalBackupService;
    constructor(backupService: BackupService, schedulerService: SchedulerService, quickBackupService: QuickBackupService, safeBackupService: SafeBackupService, professionalBackupService: ProfessionalBackupService);
    createBackup(dto: CreateBackupDto, req: any): Promise<{
        success: boolean;
        jobId: string;
        message: string;
    }>;
    getBackupJobs(query: BackupStatusDto): Promise<{
        success: boolean;
        data: any[];
    }>;
    getBackupJob(jobId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    deleteBackup(jobId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getBackupStats(): Promise<{
        success: boolean;
        data: any;
    }>;
    createSchedule(dto: CreateScheduleDto): Promise<{
        success: boolean;
        data: any;
    }>;
    getSchedules(): Promise<{
        success: boolean;
        data: any[];
    }>;
    updateSchedule(id: number, dto: UpdateScheduleDto): Promise<{
        success: boolean;
        data: any;
    }>;
    deleteSchedule(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
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
    createSafeBackup(): Promise<{
        success: boolean;
        message: string;
        metadata?: any;
    }>;
    listSafeBackups(): Promise<any[]>;
    deleteSafeBackup(fileName: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createProfessionalBackup(dto: {
        type?: 'logical' | 'custom';
    }): Promise<{
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
    listProfessionalBackups(): Promise<{
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
    downloadProfessionalBackup(fileName: string, res: Response): Promise<Response<any, Record<string, any>>>;
    restoreProfessionalBackup(body: {
        fileName: string;
    }): Promise<{
        success: boolean;
        fileName: string;
        duration: string;
        restoredAt: string;
        warnings: string;
    } | {
        success: boolean;
        error: any;
    }>;
    cleanupProfessionalBackups(days?: number): Promise<{
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
