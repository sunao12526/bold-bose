import { NotifyService } from './notify.service';
export declare class NotifyTemplateController {
    private notifyService;
    constructor(notifyService: NotifyService);
    create(data: any): Promise<{
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
    findAll(): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, data: any): Promise<{
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
    remove(id: number): Promise<{
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
    sendTest(userId: number, templateCode: string, variables: Record<string, string>): Promise<{
        success: boolean;
    }>;
}
