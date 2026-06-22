import { RefundService } from './refund.service';
import { RefundQueryDto } from './dto/refund-query.dto';
export declare class RefundController {
    private refundService;
    constructor(refundService: RefundService);
    refundNotify(merchantRefundId: string, refundId: number, status: string, refundTime: Date | string): Promise<string>;
    findAll(query: RefundQueryDto): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        order: {
            member: {
                id: number;
                status: import("@prisma/client").$Enums.CommonStatus;
                createdAt: Date;
                updatedAt: Date;
                nickname: string;
                avatar: string | null;
                mobile: string;
                experience: number;
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
        };
    } & {
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
    }>;
    approve(id: number, auditRemark?: string): Promise<({
        order: {
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
        };
    } & {
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
    }) | null>;
    reject(id: number, auditRemark: string): Promise<{
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
    }>;
}
