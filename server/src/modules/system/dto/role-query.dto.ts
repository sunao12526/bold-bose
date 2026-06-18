import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class RoleQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;
}
