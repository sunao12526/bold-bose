import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class MpTagService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        appId: string;
        tagId: number;
        name: string;
        count: number;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        accountId: number;
    }>;
    findAll(query?: any): Promise<{
        appId: string;
        tagId: number;
        name: string;
        count: number;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        accountId: number;
    }[]>;
    findOne(id: number): Promise<{
        appId: string;
        tagId: number;
        name: string;
        count: number;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        accountId: number;
    }>;
    update(id: number, data: any): Promise<{
        appId: string;
        tagId: number;
        name: string;
        count: number;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        accountId: number;
    }>;
    remove(id: number): Promise<{
        appId: string;
        tagId: number;
        name: string;
        count: number;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        accountId: number;
    }>;
}
