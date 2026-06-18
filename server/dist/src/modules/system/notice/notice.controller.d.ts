import { NoticeService } from './notice.service';
import { NoticeQueryDto } from '../dto/notice-query.dto';
export declare class NoticeController {
    private readonly service;
    constructor(service: NoticeService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        type: number;
        title: string;
        content: string;
    }>;
    findAll(query: NoticeQueryDto): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        type: number;
        title: string;
        content: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        type: number;
        title: string;
        content: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        type: number;
        title: string;
        content: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        type: number;
        title: string;
        content: string;
    }>;
}
