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
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            spuId: number;
            skuId: number;
            spuName: string;
            count: number;
            orderId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        memberId: number;
        no: string;
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
        payTime: Date | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        member: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            nickname: string;
            mobile: string;
            experience: number;
            avatar: string | null;
            points: number;
            balance: number;
            levelId: number | null;
            tagIds: import("@prisma/client/runtime/library").JsonValue | null;
        };
        items: {
            id: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            spuId: number;
            skuId: number;
            spuName: string;
            count: number;
            orderId: number;
        }[];
        refunds: {
            id: number;
            status: import("@prisma/client").$Enums.MallRefundStatus;
            createdAt: Date;
            updatedAt: Date;
            memberId: number;
            no: string;
            userRemark: string | null;
            refundPrice: number;
            reason: string;
            auditRemark: string | null;
            auditTime: Date | null;
            orderId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        memberId: number;
        no: string;
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
        payTime: Date | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
    adjustPrice(id: number, discountPrice: number, payPrice: number): Promise<{
        items: {
            id: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            spuId: number;
            skuId: number;
            spuName: string;
            count: number;
            orderId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        memberId: number;
        no: string;
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
        payTime: Date | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
    payMock(id: number): Promise<{
        items: {
            id: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            spuId: number;
            skuId: number;
            spuName: string;
            count: number;
            orderId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        memberId: number;
        no: string;
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
        payTime: Date | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
    ship(id: number, logisticsCo: string, logisticsNo: string): Promise<{
        items: {
            id: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            spuId: number;
            skuId: number;
            spuName: string;
            count: number;
            orderId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        memberId: number;
        no: string;
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
        payTime: Date | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
    cancel(id: number): Promise<{
        items: {
            id: number;
            picUrl: string;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            spuId: number;
            skuId: number;
            spuName: string;
            count: number;
            orderId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.MallOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        memberId: number;
        no: string;
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
        payTime: Date | null;
        deliveryTime: Date | null;
        receiveTime: Date | null;
    }>;
}
