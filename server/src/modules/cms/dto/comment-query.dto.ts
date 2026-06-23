import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CmsCommentStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const CommentQuerySchema = PaginationQuerySchema.extend({
  articleId: z.coerce.number().int().optional(),
  status: z.enum(CmsCommentStatus).optional(),
});

export class CommentQueryDto extends createZodDto(CommentQuerySchema) {}
