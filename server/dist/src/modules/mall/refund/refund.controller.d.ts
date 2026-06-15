import { RefundService } from './refund.service';
export declare class RefundController {
    private refundService;
    constructor(refundService: RefundService);
    refundNotify(merchantRefundId: string, refundId: number, status: string, refundTime: Date | string): Promise<string>;
    findAll(): Promise<({
        order: {
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
        };
    } & {
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
    })[]>;
    findOne(id: number): Promise<{
        order: {
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
        };
    } & {
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
    }>;
    approve(id: number, auditRemark?: string): Promise<({
        order: {
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
        };
    } & {
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
    }) | null>;
    reject(id: number, auditRemark: string): Promise<{
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
    }>;
}
