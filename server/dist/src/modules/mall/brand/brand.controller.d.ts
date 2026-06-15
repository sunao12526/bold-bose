import { BrandService } from './brand.service';
export declare class BrandController {
    private brandService;
    constructor(brandService: BrandService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        logo: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        logo: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        logo: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        logo: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        logo: string | null;
    }>;
}
