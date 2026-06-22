import { IsNotEmpty, IsString, IsOptional, IsInt, IsArray, IsEnum, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

export class SkuPropertyDto {
  @IsInt()
  @IsNotEmpty()
  propertyId!: number;

  @IsString()
  @IsNotEmpty()
  propertyName!: string;

  @IsInt()
  @IsNotEmpty()
  valueId!: number;

  @IsString()
  @IsNotEmpty()
  valueName!: string;
}

export class SkuDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkuPropertyDto)
  @IsNotEmpty()
  properties!: SkuPropertyDto[];

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  price!: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  marketPrice?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  stock!: number;

  @IsString()
  @IsOptional()
  picUrl?: string;

  @IsString()
  @IsOptional()
  barCode?: string;
}

export class CreateSpuDto {
  @IsString()
  @IsNotEmpty({ message: '商品名称不能为空' })
  name!: string;

  @IsInt({ message: '分类ID必须是整数' })
  @IsNotEmpty({ message: '分类ID不能为空' })
  categoryId!: number;

  @IsInt({ message: '品牌ID必须是整数' })
  @IsOptional()
  brandId?: number;

  @IsString({ message: '商品图片URL必须是字符串' })
  @IsNotEmpty({ message: '商品主图不能为空' })
  picUrl!: string;

  @IsArray({ message: '轮播图URL必须是数组' })
  @IsString({ each: true, message: '每个轮播图URL必须是字符串' })
  @IsNotEmpty({ message: '轮播图不能为空' })
  sliderPicUrls!: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sort?: number;

  @IsEnum(CommonStatus, { message: '状态值不合法' })
  @IsOptional()
  status?: CommonStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkuDto)
  @IsNotEmpty({ message: 'SKU列表不能为空' })
  skus!: SkuDto[];
}

export class UpdateSpuDto extends CreateSpuDto {}

export class SpuQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brandId?: number;

  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;
}
