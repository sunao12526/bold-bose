import { NotifyService } from './notify.service';
export declare class NotifyMessageController {
    private notifyService;
    constructor(notifyService: NotifyService);
    getMyInbox(req: any): Promise<{
        id: number;
        username: string;
        status: number;
        createdAt: Date;
        userId: number;
        title: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        templateCode: string;
        read: boolean;
        readTime: Date | null;
    }[]>;
    markRead(req: any, id: number): Promise<{
        id: number;
        username: string;
        status: number;
        createdAt: Date;
        userId: number;
        title: string;
        content: string;
        templateId: number;
        errorMessage: string | null;
        templateCode: string;
        read: boolean;
        readTime: Date | null;
    }>;
    markAllRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
