import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CmsArticleStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const ArticleQuerySchema = PaginationQuerySchema.extend({
  categoryId: z.coerce.number().int().optional(),
  status: z.enum(CmsArticleStatus).optional(),
  title: z.string().optional(),
});

export class ArticleQueryDto extends createZodDto(ArticleQuerySchema) {}
