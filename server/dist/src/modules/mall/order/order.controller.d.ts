import { OrderService } from './order.service';
import { MallOrderStatus } from '@prisma/client';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    findAll(status?: MallOrderStatus): Promise<({
        member: {
            id: number;
            nickname: string;
            mobile: string;
        };
        items: {
            id: number;
            price: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            spuId: number;
            orderId: number;
            skuId: number;
            spuName: string;
            count: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        payTime: Date | null;
        no: string;
        memberId: number;
        payPrice: number;
        totalPrice: number;
        discountPrice: number;
        deliveryStatus: boolean;
        logisticsCo: string | null;
        logisticsNo: string | null;
        receiverName: string;
        receiverMobile: string;
        receiverAddress: string;
        userRemark: string | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        refunds: {
            id: number;
            status: import("@prisma/client").$Enums.MallRefundStatus;
            createdAt: Date;
            updatedAt: Date;
            refundPrice: number;
            reason: string;
            no: string;
            memberId: number;
            userRemark: string | null;
            orderId: number;
            auditRemark: string | null;
            auditTime: Date | null;
        }[];
        member: {
            id: number;
            nickname: string;
            mobile: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            avatar: string | null;
            points: number;
            balance: number;
            levelId: number | null;
            experience: number;
            tagIds: import("@prisma/client/runtime/library").JsonValue | null;
        };
        items: {
            id: number;
            price: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            spuId: number;
            orderId: number;
            skuId: number;
            spuName: string;
            count: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        payTime: Date | null;
        no: string;
        memberId: number;
        payPrice: number;
        totalPrice: number;
        discountPrice: number;
        deliveryStatus: boolean;
        logisticsCo: string | null;
        logisticsNo: string | null;
        receiverName: string;
        receiverMobile: string;
        receiverAddress: string;
        userRemark: string | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
    adjustPrice(id: number, discountPrice: number, payPrice: number): Promise<{
        items: {
            id: number;
            price: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            spuId: number;
            orderId: number;
            skuId: number;
            spuName: string;
            count: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        payTime: Date | null;
        no: string;
        memberId: number;
        payPrice: number;
        totalPrice: number;
        discountPrice: number;
        deliveryStatus: boolean;
        logisticsCo: string | null;
        logisticsNo: string | null;
        receiverName: string;
        receiverMobile: string;
        receiverAddress: string;
        userRemark: string | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
    payMock(id: number): Promise<({
        items: {
            id: number;
            price: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            spuId: number;
            orderId: number;
            skuId: number;
            spuName: string;
            count: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        payTime: Date | null;
        no: string;
        memberId: number;
        payPrice: number;
        totalPrice: number;
        discountPrice: number;
        deliveryStatus: boolean;
        logisticsCo: string | null;
        logisticsNo: string | null;
        receiverName: string;
        receiverMobile: string;
        receiverAddress: string;
        userRemark: string | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }) | null>;
    payNotify(merchantOrderId: string, payOrderId: number, status: string, payTime: Date | string): Promise<string>;
    ship(id: number, logisticsCo: string, logisticsNo: string): Promise<{
        items: {
            id: number;
            price: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            spuId: number;
            orderId: number;
            skuId: number;
            spuName: string;
            count: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        payTime: Date | null;
        no: string;
        memberId: number;
        payPrice: number;
        totalPrice: number;
        discountPrice: number;
        deliveryStatus: boolean;
        logisticsCo: string | null;
        logisticsNo: string | null;
        receiverName: string;
        receiverMobile: string;
        receiverAddress: string;
        userRemark: string | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
    cancel(id: number): Promise<{
        items: {
            id: number;
            price: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            spuId: number;
            orderId: number;
            skuId: number;
            spuName: string;
            count: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        payTime: Date | null;
        no: string;
        memberId: number;
        payPrice: number;
        totalPrice: number;
        discountPrice: number;
        deliveryStatus: boolean;
        logisticsCo: string | null;
        logisticsNo: string | null;
        receiverName: string;
        receiverMobile: string;
        receiverAddress: string;
        userRemark: string | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
}
