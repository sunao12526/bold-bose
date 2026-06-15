import { JobService } from './job.service';
export declare class JobLogController {
    private readonly jobService;
    constructor(jobService: JobService);
    findAll(): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        errorMessage: string | null;
        handlerName: string;
        jobId: number;
        duration: number;
    }[]>;
}
