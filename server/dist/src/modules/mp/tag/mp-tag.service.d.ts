import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class MpTagService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        count: number;
        appId: string;
        accountId: number;
        tagId: number;
    }>;
    findAll(query?: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        count: number;
        appId: string;
        accountId: number;
        tagId: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        count: number;
        appId: string;
        accountId: number;
        tagId: number;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        count: number;
        appId: string;
        accountId: number;
        tagId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        count: number;
        appId: string;
        accountId: number;
        tagId: number;
    }>;
}
