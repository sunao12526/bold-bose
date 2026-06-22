import { SpuService } from './spu.service';
import { CreateSpuDto, UpdateSpuDto, SpuQueryDto } from './dto/spu.dto';
export declare class SpuController {
    private spuService;
    constructor(spuService: SpuService);
    create(data: CreateSpuDto): Promise<{
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
    findAll(query: SpuQueryDto): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
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
    update(id: number, data: UpdateSpuDto): Promise<{
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
