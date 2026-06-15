import { PayAppService } from './app.service';
import { CommonStatus } from '@prisma/client';
export declare class PayAppController {
    private appService;
    constructor(appService: PayAppService);
    create(name: string, code: string, status: CommonStatus, remark?: string): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        channels: {
            id: number;
            code: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            config: import("@prisma/client/runtime/library").JsonValue;
            appId: number;
        }[];
    } & {
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        channels: {
            id: number;
            code: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            config: import("@prisma/client/runtime/library").JsonValue;
            appId: number;
        }[];
    } & {
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, name?: string, code?: string, status?: CommonStatus, remark?: string): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
