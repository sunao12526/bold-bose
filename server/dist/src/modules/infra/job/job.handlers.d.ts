import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class JobHandlers {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logCleanupJob(): Promise<void>;
    demoTaskJob(): Promise<void>;
    sessionCleanupJob(): Promise<void>;
}
