import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  deptId?: number;
}
