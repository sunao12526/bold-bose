import { PayOrderService } from './pay-order.service';
export declare class PayOrderController {
    private orderService;
    constructor(orderService: PayOrderService);
    findAll(): Promise<({
        app: {
            id: number;
            name: string;
            code: string;
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
    })[]>;
    findOne(id: number): Promise<{
        app: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
        };
        refunds: {
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
        }[];
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
    }>;
    submit(id: number, channelCode: string): Promise<{
        status: "SUCCESS";
        order: {
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
        displayMode?: undefined;
        displayInfo?: undefined;
    } | {
        status: "UNPAID";
        order: {
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
        displayMode: string;
        displayInfo: string;
    }>;
    payMock(id: number): Promise<{
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
    }>;
}
