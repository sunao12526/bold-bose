import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class BannerQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;
}
