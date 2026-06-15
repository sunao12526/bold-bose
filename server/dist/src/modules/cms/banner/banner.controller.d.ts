import { BannerService } from './banner.service';
export declare class BannerController {
    private bannerService;
    constructor(bannerService: BannerService);
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
    findAll(): Promise<{
        id: number;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        picUrl: string;
        url: string | null;
    }[]>;
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
