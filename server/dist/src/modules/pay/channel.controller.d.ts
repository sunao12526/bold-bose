import { PayChannelService } from './channel.service';
import { CommonStatus } from '@prisma/client';
export declare class PayChannelController {
    private channelService;
    constructor(channelService: PayChannelService);
    createOrUpdate(appId: number, code: string, config: any, status?: CommonStatus, remark?: string): Promise<{
        id: number;
        code: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        config: import("@prisma/client/runtime/library").JsonValue;
        appId: number;
    }>;
    findByApp(appId: number): Promise<{
        id: number;
        code: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        config: import("@prisma/client/runtime/library").JsonValue;
        appId: number;
    }[]>;
    findChannel(appId: number, code: string): Promise<{
        id: number;
        code: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        config: import("@prisma/client/runtime/library").JsonValue;
        appId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        code: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        config: import("@prisma/client/runtime/library").JsonValue;
        appId: number;
    }>;
}
