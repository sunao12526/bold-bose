import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class MpMessageService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        id: number;
        msgId: bigint | null;
        accountId: number;
        appId: string;
        userId: number | null;
        openid: string;
        type: string;
        sendFrom: number;
        content: string | null;
        mediaId: string | null;
        mediaUrl: string | null;
        title: string | null;
        url: string | null;
        event: string | null;
        eventKey: string | null;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        msgId: bigint | null;
        accountId: number;
        appId: string;
        userId: number | null;
        openid: string;
        type: string;
        sendFrom: number;
        content: string | null;
        mediaId: string | null;
        mediaUrl: string | null;
        title: string | null;
        url: string | null;
        event: string | null;
        eventKey: string | null;
        createdAt: Date;
    } | null>;
}
