import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class MpUserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        id: number;
        accountId: number;
        appId: string;
        openid: string;
        unionid: string | null;
        subscribeStatus: number;
        subscribeTime: Date | null;
        unsubscribeTime: Date | null;
        nickname: string | null;
        headImageUrl: string | null;
        language: string | null;
        country: string | null;
        province: string | null;
        city: string | null;
        remark: string | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
        sex: number | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        accountId: number;
        appId: string;
        openid: string;
        unionid: string | null;
        subscribeStatus: number;
        subscribeTime: Date | null;
        unsubscribeTime: Date | null;
        nickname: string | null;
        headImageUrl: string | null;
        language: string | null;
        country: string | null;
        province: string | null;
        city: string | null;
        remark: string | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
        sex: number | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
