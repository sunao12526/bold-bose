import { MpAccountService } from './mp-account.service';
export declare class MpAccountController {
    private service;
    constructor(service: MpAccountService);
    create(data: any): Promise<{
        name: string;
        account: string;
        appId: string;
        appSecret: string;
        token: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
        remark: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        account: string;
        appId: string;
        appSecret: string;
        token: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
        remark: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        account: string;
        appId: string;
        appSecret: string;
        token: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
        remark: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: number, data: any): Promise<{
        name: string;
        account: string;
        appId: string;
        appSecret: string;
        token: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
        remark: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        account: string;
        appId: string;
        appSecret: string;
        token: string;
        aesKey: string | null;
        qrCodeUrl: string | null;
        remark: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
