import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class MailService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createAccount(data: any): Promise<{
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
    findAllAccounts(query?: any): Promise<{
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
    findOneAccount(id: number): Promise<{
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
    updateAccount(id: number, data: any): Promise<{
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
    removeAccount(id: number): Promise<{
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
    createTemplate(data: any): Promise<{
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
    findAllTemplates(query?: any): Promise<({
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
    findOneTemplate(id: number): Promise<{
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
    updateTemplate(id: number, data: any): Promise<{
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
    removeTemplate(id: number): Promise<{
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
    findAllLogs(query?: any): Promise<({
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
    sendMail(templateCode: string, receiver: string, params: Record<string, any>): Promise<{
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
