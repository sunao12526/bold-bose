import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        picUrl: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        picUrl: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        picUrl: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        picUrl: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        picUrl: string | null;
    }>;
}
