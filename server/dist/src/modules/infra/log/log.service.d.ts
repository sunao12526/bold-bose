import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class LogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        type: string;
        path: string;
        username: string | null;
        userId: number | null;
        description: string;
        ip: string;
        method: string;
        duration: number;
        module: string;
    }[]>;
    removeOldLogs(days: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
