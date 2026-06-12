import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class LogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        path: string;
        id: number;
        status: number;
        createdAt: Date;
        type: string;
        username: string | null;
        userId: number | null;
        module: string;
        description: string;
        method: string;
        ip: string;
        duration: number;
    }[]>;
    removeOldLogs(days: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
