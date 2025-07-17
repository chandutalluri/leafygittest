import { BackupService } from './backup.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';
export declare class SchedulerService {
    private readonly backupService;
    private pool;
    private activeCronJobs;
    constructor(backupService: BackupService);
    private initializeSchedules;
    createSchedule(dto: CreateScheduleDto, createdBy: string): Promise<any>;
    getSchedules(limit?: number, activeOnly?: boolean): Promise<any[]>;
    getSchedule(scheduleId: number): Promise<any>;
    updateSchedule(scheduleId: number, dto: UpdateScheduleDto, updatedBy: string): Promise<any>;
    deleteSchedule(scheduleId: number, deletedBy: string): Promise<void>;
    toggleSchedule(scheduleId: number, updatedBy: string): Promise<any>;
    private getActiveSchedules;
    private startCronJob;
    private stopCronJob;
    private validateCronExpression;
    private getNextRunTime;
    private updateLastRunTime;
    private cleanupOldBackups;
}
