import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CmsCommentStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class CommentQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  articleId?: number;

  @IsOptional()
  @IsEnum(CmsCommentStatus)
  status?: CmsCommentStatus;
}
