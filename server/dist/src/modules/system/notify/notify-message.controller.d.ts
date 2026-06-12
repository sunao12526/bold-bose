import { NotifyService } from './notify.service';
export declare class NotifyMessageController {
    private notifyService;
    constructor(notifyService: NotifyService);
    getMyInbox(req: any): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        username: string;
        userId: number;
        title: string;
        content: string;
        templateCode: string;
        read: boolean;
        readTime: Date | null;
        errorMessage: string | null;
        templateId: number;
    }[]>;
    markRead(req: any, id: number): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        username: string;
        userId: number;
        title: string;
        content: string;
        templateCode: string;
        read: boolean;
        readTime: Date | null;
        errorMessage: string | null;
        templateId: number;
    }>;
    markAllRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
