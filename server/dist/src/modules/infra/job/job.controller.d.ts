import { JobService } from './job.service';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    create(data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        handlerName: string;
        cronExpression: string;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        handlerName: string;
        cronExpression: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        handlerName: string;
        cronExpression: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        handlerName: string;
        cronExpression: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        handlerName: string;
        cronExpression: string;
    }>;
    executeOnce(id: number): Promise<{
        success: boolean;
    }>;
}
