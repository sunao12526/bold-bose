import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotifyService } from './notify.service';
export declare class PayRefundService {
    private prisma;
    private notifyService;
    constructor(prisma: PrismaService, notifyService: NotifyService);
    createRefund(data: {
        appCode: string;
        merchantOrderId: string;
        merchantRefundId: string;
        refundPrice: number;
        reason: string;
        merchantNotifyUrl: string;
    }): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.PayRefundStatus;
        appId: number;
        payOrderId: number;
        price: number;
        merchantNotifyUrl: string;
        notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
        merchantRefundId: string;
        refundPrice: number;
        reason: string;
        refundTime: Date | null;
    }>;
    refundMock(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.PayRefundStatus;
        appId: number;
        payOrderId: number;
        price: number;
        merchantNotifyUrl: string;
        notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
        merchantRefundId: string;
        refundPrice: number;
        reason: string;
        refundTime: Date | null;
    }>;
    findAll(): Promise<({
        payOrder: {
            id: number;
            subject: string;
            merchantOrderId: string;
            channelCode: string | null;
        };
        notifyLogs: {
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
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.PayRefundStatus;
        appId: number;
        payOrderId: number;
        price: number;
        merchantNotifyUrl: string;
        notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
        merchantRefundId: string;
        refundPrice: number;
        reason: string;
        refundTime: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        payOrder: {
            id: number;
            status: import("@prisma/client").$Enums.PayOrderStatus;
            subject: string;
            appId: number;
            merchantOrderId: string;
            price: number;
            channelCode: string | null;
            payTime: Date | null;
            expireTime: Date;
            merchantNotifyUrl: string;
            notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
        };
        notifyLogs: {
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
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.PayRefundStatus;
        appId: number;
        payOrderId: number;
        price: number;
        merchantNotifyUrl: string;
        notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
        merchantRefundId: string;
        refundPrice: number;
        reason: string;
        refundTime: Date | null;
    }>;
}
