import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class BannerService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        picUrl: string;
        url: string | null;
    }>;
    findAll(query?: any): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        id: number;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        picUrl: string;
        url: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        picUrl: string;
        url: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        picUrl: string;
        url: string | null;
    }>;
}
