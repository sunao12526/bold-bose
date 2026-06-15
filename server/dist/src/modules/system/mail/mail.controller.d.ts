import { MailService } from './mail.service';
export declare class MailAccountController {
    private readonly service;
    constructor(service: MailService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        mail: string;
        host: string;
        port: number;
        ssl: boolean;
    }>;
    findAll(query: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        mail: string;
        host: string;
        port: number;
        ssl: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        mail: string;
        host: string;
        port: number;
        ssl: boolean;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        mail: string;
        host: string;
        port: number;
        ssl: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        mail: string;
        host: string;
        port: number;
        ssl: boolean;
    }>;
}
export declare class MailTemplateController {
    private readonly service;
    constructor(service: MailService);
    create(data: any): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        accountId: number;
    }>;
    findAll(query: any): Promise<({
        account: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            password: string;
            mail: string;
            host: string;
            port: number;
            ssl: boolean;
        };
    } & {
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        accountId: number;
    })[]>;
    findOne(id: number): Promise<{
        account: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            password: string;
            mail: string;
            host: string;
            port: number;
            ssl: boolean;
        };
    } & {
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        accountId: number;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        accountId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        accountId: number;
    }>;
    sendMock(id: number, body: any): Promise<{
        id: number;
        status: string;
        title: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        sendTime: Date;
        receiver: string;
    }>;
}
export declare class MailLogController {
    private readonly service;
    constructor(service: MailService);
    findAll(query: any): Promise<({
        template: {
            account: {
                id: number;
                status: import("@prisma/client").$Enums.CommonStatus;
                createdAt: Date;
                updatedAt: Date;
                username: string;
                password: string;
                mail: string;
                host: string;
                port: number;
                ssl: boolean;
            };
        } & {
            id: number;
            code: string;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            accountId: number;
        };
    } & {
        id: number;
        status: string;
        title: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        sendTime: Date;
        receiver: string;
    })[]>;
}
