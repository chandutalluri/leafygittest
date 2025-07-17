import { SchedulerService } from '../services/scheduler.service';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleStatusDto } from '../dto/schedule.dto';
export declare class ScheduleController {
    private readonly schedulerService;
    constructor(schedulerService: SchedulerService);
    createSchedule(dto: CreateScheduleDto, req: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getSchedules(query: ScheduleStatusDto): Promise<{
        success: boolean;
        data: any[];
    }>;
    getSchedule(scheduleId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    updateSchedule(scheduleId: string, dto: UpdateScheduleDto, req: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    deleteSchedule(scheduleId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleSchedule(scheduleId: string, req: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
}
