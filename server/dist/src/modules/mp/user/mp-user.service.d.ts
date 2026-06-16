import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class MpUserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        nickname: string | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
        appId: string;
        accountId: number;
        openid: string;
        unionid: string | null;
        subscribeStatus: number;
        subscribeTime: Date | null;
        unsubscribeTime: Date | null;
        headImageUrl: string | null;
        language: string | null;
        country: string | null;
        province: string | null;
        city: string | null;
        sex: number | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        nickname: string | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
        appId: string;
        accountId: number;
        openid: string;
        unionid: string | null;
        subscribeStatus: number;
        subscribeTime: Date | null;
        unsubscribeTime: Date | null;
        headImageUrl: string | null;
        language: string | null;
        country: string | null;
        province: string | null;
        city: string | null;
        sex: number | null;
    } | null>;
}
