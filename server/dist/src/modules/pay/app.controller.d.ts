import { PayAppService } from './app.service';
import { CommonStatus } from '@prisma/client';
export declare class PayAppController {
    private appService;
    constructor(appService: PayAppService);
    create(name: string, code: string, status: CommonStatus, remark?: string): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
    findAll(): Promise<({
        channels: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            config: import("@prisma/client/runtime/library").JsonValue;
            appId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    })[]>;
    findOne(id: number): Promise<{
        channels: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            config: import("@prisma/client/runtime/library").JsonValue;
            appId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
    update(id: number, name?: string, code?: string, status?: CommonStatus, remark?: string): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
}
