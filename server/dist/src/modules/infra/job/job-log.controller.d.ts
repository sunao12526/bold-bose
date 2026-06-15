import { JobService } from './job.service';
export declare class JobLogController {
    private readonly jobService;
    constructor(jobService: JobService);
    findAll(): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        handlerName: string;
        errorMessage: string | null;
        duration: number;
        jobId: number;
    }[]>;
}
