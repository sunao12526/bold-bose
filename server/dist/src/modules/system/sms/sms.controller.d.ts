import { SmsService } from './sms.service';
export declare class SmsChannelController {
    private readonly service;
    constructor(service: SmsService);
    create(data: any): Promise<{
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
    findAll(query: any): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, data: any): Promise<{
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
    remove(id: number): Promise<{
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
}
export declare class SmsTemplateController {
    private readonly service;
    constructor(service: SmsService);
    create(data: any): Promise<{
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
    findAll(query: any): Promise<({
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
    findOne(id: number): Promise<{
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
    update(id: number, data: any): Promise<{
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
    remove(id: number): Promise<{
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
    sendMock(id: number, body: any): Promise<{
        id: number;
        mobile: string;
        status: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        sendTime: Date;
    }>;
}
export declare class SmsLogController {
    private readonly service;
    constructor(service: SmsService);
    findAll(query: any): Promise<({
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
}
