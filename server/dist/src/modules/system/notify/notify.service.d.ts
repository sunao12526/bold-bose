import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ConfigService } from '../config/config.service';
export declare class NotifyService {
    private prisma;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createTemplate(data: any): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        content: string;
    }>;
    findAllTemplates(): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        content: string;
    }[]>;
    findOneTemplate(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        content: string;
    }>;
    updateTemplate(id: number, data: any): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        content: string;
    }>;
    removeTemplate(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        content: string;
    }>;
    private render;
    send(userId: number, templateCode: string, variables?: Record<string, string>): Promise<{
        success: boolean;
    }>;
    private sendEmail;
    getMyInbox(userId: number): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        username: string;
        userId: number;
        title: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        templateCode: string;
        read: boolean;
        readTime: Date | null;
    }[]>;
    markRead(userId: number, messageId: number): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        username: string;
        userId: number;
        title: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        templateCode: string;
        read: boolean;
        readTime: Date | null;
    }>;
    markAllRead(userId: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
