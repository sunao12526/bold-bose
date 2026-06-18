import { MpMessageService } from './mp-message.service';
import { MessageQueryDto } from '../dto/message-query.dto';
export declare class MpMessageController {
    private service;
    constructor(service: MpMessageService);
    findAll(query: MessageQueryDto): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        userId: number | null;
        title: string | null;
        content: string | null;
        appId: string;
        accountId: number;
        url: string | null;
        openid: string;
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
        url: string | null;
        openid: string;
        mediaId: string | null;
        msgId: bigint | null;
        sendFrom: number;
        mediaUrl: string | null;
        event: string | null;
        eventKey: string | null;
    } | null>;
}
