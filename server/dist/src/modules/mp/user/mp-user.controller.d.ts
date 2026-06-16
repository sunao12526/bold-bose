import { MpUserService } from './mp-user.service';
export declare class MpUserController {
    private service;
    constructor(service: MpUserService);
    findAll(query: any): Promise<{
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
