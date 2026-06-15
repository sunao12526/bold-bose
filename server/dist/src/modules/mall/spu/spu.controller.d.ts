import { SpuService } from './spu.service';
export declare class SpuController {
    private spuService;
    constructor(spuService: SpuService);
    create(data: any): Promise<{
        skus: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        description: string | null;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
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
            price: number;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        description: string | null;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
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
            price: number;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        description: string | null;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
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
            price: number;
            picUrl: string | null;
            properties: import("@prisma/client/runtime/library").JsonValue;
            marketPrice: number | null;
            costPrice: number | null;
            stock: number;
            barCode: string | null;
            spuId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        description: string | null;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
        salesCount: number;
        minPrice: number;
        maxPrice: number;
        totalStock: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        description: string | null;
        picUrl: string;
        categoryId: number;
        brandId: number | null;
        sliderPicUrls: import("@prisma/client/runtime/library").JsonValue;
        salesCount: number;
        minPrice: number;
        maxPrice: number;
        totalStock: number;
    }>;
}
