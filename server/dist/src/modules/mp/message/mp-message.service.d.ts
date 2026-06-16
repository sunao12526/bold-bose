import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class MpMessageService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        userId: number | null;
        title: string | null;
        content: string | null;
        appId: string;
        accountId: number;
        openid: string;
        url: string | null;
        mediaId: string | null;
        msgId: bigint | null;
        sendFrom: number;
        mediaUrl: string | null;
        event: string | null;
        eventKey: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        userId: number | null;
        title: string | null;
        content: string | null;
        appId: string;
        accountId: number;
        openid: string;
        url: string | null;
        mediaId: string | null;
        msgId: bigint | null;
        sendFrom: number;
        mediaUrl: string | null;
        event: string | null;
        eventKey: string | null;
    } | null>;
}
