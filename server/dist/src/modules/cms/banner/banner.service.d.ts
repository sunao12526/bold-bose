import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class BannerService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        title: string;
        picUrl: string;
        url: string | null;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(query?: any): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        title: string;
        picUrl: string;
        url: string | null;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: number, data: any): Promise<{
        title: string;
        picUrl: string;
        url: string | null;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        title: string;
        picUrl: string;
        url: string | null;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
