import { PrismaService } from '../../shared/prisma/prisma.service';
import { PayNotifyType } from '@prisma/client';
export declare class NotifyService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createNotifyTask(type: PayNotifyType, dataId: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.PayNotifyStatus;
        type: import("@prisma/client").$Enums.PayNotifyType;
        appId: number;
        attemptCount: number;
        lastAttemptTime: Date | null;
        nextNotifyTime: Date | null;
        responseContent: string | null;
        payOrderId: number | null;
        refundId: number | null;
    } | undefined>;
    sendNotification(logId: number): Promise<void>;
}
