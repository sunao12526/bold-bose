import { MpMessageService } from './mp-message.service';
export declare class MpMessageController {
    private service;
    constructor(service: MpMessageService);
    findAll(query: any): Promise<{
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
