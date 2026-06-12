import { SpuService } from './spu.service';
export declare class SpuController {
    private spuService;
    constructor(spuService: SpuService);
    create(data: any): Promise<{
        skus: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        salesCount: number;
        minPrice: number;
        maxPrice: number;
        totalStock: number;
    }>;
    findAll(): Promise<({
        category: {
            id: number;
            name: string;
        };
        brand: {
            id: number;
            name: string;
        } | null;
        skus: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        salesCount: number;
        minPrice: number;
        maxPrice: number;
        totalStock: number;
    })[]>;
    findOne(id: number): Promise<{
        skus: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        salesCount: number;
        minPrice: number;
        maxPrice: number;
        totalStock: number;
    }>;
    update(id: number, data: any): Promise<{
        skus: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            price: number;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        salesCount: number;
        minPrice: number;
        maxPrice: number;
        totalStock: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        salesCount: number;
        minPrice: number;
        maxPrice: number;
        totalStock: number;
    }>;
}
