import { SmsService } from './sms.service';
import { SmsChannelQueryDto } from '../dto/sms-channel-query.dto';
import { SmsTemplateQueryDto } from '../dto/sms-template-query.dto';
import { SmsLogQueryDto } from '../dto/sms-log-query.dto';
export declare class SmsChannelController {
    private readonly service;
    constructor(service: SmsService);
    create(data: any): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }>;
    findAll(query: SmsChannelQueryDto): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string;
        apiSecret: string;
        signature: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        channelId: number;
    }>;
    findAll(query: SmsTemplateQueryDto): Promise<({
        channel: {
            id: number;
            code: string;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            apiKey: string;
            apiSecret: string;
            signature: string;
        };
    } & {
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        channelId: number;
    })[]>;
    findOne(id: number): Promise<{
        channel: {
            id: number;
            code: string;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            apiKey: string;
            apiSecret: string;
            signature: string;
        };
    } & {
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        channelId: number;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        channelId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        channelId: number;
    }>;
    sendMock(id: number, body: any): Promise<{
        id: number;
        status: string;
        mobile: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        sendTime: Date;
    }>;
}
export declare class SmsLogController {
    private readonly service;
    constructor(service: SmsService);
    findAll(query: SmsLogQueryDto): Promise<({
        template: {
            channel: {
                id: number;
                code: string;
                name: string;
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
                updatedAt: Date;
                apiKey: string;
                apiSecret: string;
                signature: string;
            };
        } & {
            id: number;
            code: string;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            channelId: number;
        };
    } & {
        id: number;
        status: string;
        mobile: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        sendTime: Date;
    })[]>;
}
