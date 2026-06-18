import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CmsArticleStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class ArticleQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsEnum(CmsArticleStatus)
  status?: CmsArticleStatus;

  @IsOptional()
  @IsString()
  title?: string;
}
