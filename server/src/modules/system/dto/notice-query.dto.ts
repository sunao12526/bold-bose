import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const NoticeQuerySchema = PaginationQuerySchema.extend({
  title: z.string().optional(),
  type: z.coerce.number().int().optional(),
  status: z.string().optional(),
});

export class NoticeQueryDto extends createZodDto(NoticeQuerySchema) {}
