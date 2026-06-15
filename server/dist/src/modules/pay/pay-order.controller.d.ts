import { PayOrderService } from './pay-order.service';
export declare class PayOrderController {
    private orderService;
    constructor(orderService: PayOrderService);
    findAll(): Promise<({
        app: {
            id: number;
            code: string;
            name: string;
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
        price: number;
        payTime: Date | null;
        appId: number;
        subject: string;
        merchantOrderId: string;
        channelCode: string | null;
        expireTime: Date;
        merchantNotifyUrl: string;
        notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
    })[]>;
    findOne(id: number): Promise<{
        refunds: {
            id: number;
            status: import("@prisma/client").$Enums.PayRefundStatus;
            price: number;
            refundPrice: number;
            reason: string;
            appId: number;
            merchantNotifyUrl: string;
            notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
            payOrderId: number;
            merchantRefundId: string;
            refundTime: Date | null;
        }[];
        app: {
            id: number;
            code: string;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        price: number;
        payTime: Date | null;
        appId: number;
        subject: string;
        merchantOrderId: string;
        channelCode: string | null;
        expireTime: Date;
        merchantNotifyUrl: string;
        notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
    }>;
    submit(id: number, channelCode: string): Promise<{
        status: "SUCCESS";
        order: {
            id: number;
            status: import("@prisma/client").$Enums.PayOrderStatus;
            price: number;
            payTime: Date | null;
            appId: number;
            subject: string;
            merchantOrderId: string;
            channelCode: string | null;
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
            price: number;
            payTime: Date | null;
            appId: number;
            subject: string;
            merchantOrderId: string;
            channelCode: string | null;
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
        price: number;
        payTime: Date | null;
        appId: number;
        subject: string;
        merchantOrderId: string;
        channelCode: string | null;
        expireTime: Date;
        merchantNotifyUrl: string;
        notifyStatus: import("@prisma/client").$Enums.PayNotifyStatus;
    }>;
}
