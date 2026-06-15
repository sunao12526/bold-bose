import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class LogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        username: string | null;
        status: number;
        createdAt: Date;
        userId: number | null;
        type: string;
        ip: string;
        path: string;
        method: string;
        description: string;
        duration: number;
        module: string;
    }[]>;
    removeOldLogs(days: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
