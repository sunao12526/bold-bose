import { CommonStatus } from '@prisma/client';
export declare class SkuPropertyDto {
    propertyId: number;
    propertyName: string;
    valueId: number;
    valueName: string;
}
export declare class SkuDto {
    properties: SkuPropertyDto[];
    price: number;
    marketPrice?: number;
    costPrice?: number;
    stock: number;
    picUrl?: string;
    barCode?: string;
}
export declare class CreateSpuDto {
    name: string;
    categoryId: number;
    brandId?: number;
    picUrl: string;
    sliderPicUrls: string[];
    description?: string;
    sort?: number;
    status?: CommonStatus;
    skus: SkuDto[];
}
export declare class UpdateSpuDto extends CreateSpuDto {
}
