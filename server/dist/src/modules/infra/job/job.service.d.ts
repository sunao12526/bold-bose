import { OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { JobHandlers } from './job.handlers';
export declare class JobService implements OnApplicationBootstrap {
    private prisma;
    private schedulerRegistry;
    private jobHandlers;
    private runningJobs;
    constructor(prisma: PrismaService, schedulerRegistry: SchedulerRegistry, jobHandlers: JobHandlers);
    onApplicationBootstrap(): Promise<void>;
    registerJob(jobRecord: any): Promise<void>;
    unregisterJob(jobId: number): void;
    runJobWrapper(jobId: number, handlerName: string): Promise<void>;
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
    findAllLogs(): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        handlerName: string;
        errorMessage: string | null;
        duration: number;
        jobId: number;
    }[]>;
}
