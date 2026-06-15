import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class SmsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createChannel(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }>;
    findAllChannels(query?: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }[]>;
    findOneChannel(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }>;
    updateChannel(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }>;
    removeChannel(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }>;
    createTemplate(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        content: string;
        channelId: number;
    }>;
    findAllTemplates(query?: any): Promise<({
        channel: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            apiKey: string;
            apiSecret: string;
            signature: string;
        };
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        content: string;
        channelId: number;
    })[]>;
    findOneTemplate(id: number): Promise<{
        channel: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            apiKey: string;
            apiSecret: string;
            signature: string;
        };
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        content: string;
        channelId: number;
    }>;
    updateTemplate(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        content: string;
        channelId: number;
    }>;
    removeTemplate(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        content: string;
        channelId: number;
    }>;
    findAllLogs(query?: any): Promise<({
        template: {
            channel: {
                id: number;
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string;
                apiKey: string;
                apiSecret: string;
                signature: string;
            };
        } & {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            content: string;
            channelId: number;
        };
    } & {
        id: number;
        mobile: string;
        status: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        sendTime: Date;
    })[]>;
    sendSms(templateCode: string, mobile: string, params: Record<string, any>): Promise<{
        id: number;
        mobile: string;
        status: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        sendTime: Date;
    }>;
}
