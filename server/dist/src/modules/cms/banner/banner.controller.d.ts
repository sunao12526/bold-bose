import { BannerService } from './banner.service';
import { BannerQueryDto } from '../dto/banner-query.dto';
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
    findAll(query: BannerQueryDto): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
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
