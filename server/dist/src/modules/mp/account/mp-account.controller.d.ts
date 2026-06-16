import { MpAccountService } from './mp-account.service';
export declare class MpAccountController {
    private service;
    constructor(service: MpAccountService);
    create(data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        appId: string;
        account: string;
        token: string;
        appSecret: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        appId: string;
        account: string;
        token: string;
        appSecret: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        appId: string;
        account: string;
        token: string;
        appSecret: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        appId: string;
        account: string;
        token: string;
        appSecret: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        appId: string;
        account: string;
        token: string;
        appSecret: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
    }>;
}
