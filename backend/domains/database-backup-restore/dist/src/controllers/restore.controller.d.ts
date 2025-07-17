import { RestoreService } from '../services/restore.service';
import { CreateRestoreDto, RestoreStatusDto } from '../dto/restore.dto';
export declare class RestoreController {
    private readonly restoreService;
    constructor(restoreService: RestoreService);
    startRestore(dto: CreateRestoreDto, req: any): Promise<{
        success: boolean;
        jobId: string;
        message: string;
    }>;
    getRestoreStatus(jobId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getRestoreJobs(query: RestoreStatusDto): Promise<{
        success: boolean;
        data: any[];
    }>;
}
