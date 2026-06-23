import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
