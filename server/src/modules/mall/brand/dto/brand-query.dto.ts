import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

export class BrandQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;
}
