import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const TagQuerySchema = PaginationQuerySchema.extend({
  accountId: z.coerce.number().int().optional(),
});

export class TagQueryDto extends createZodDto(TagQuerySchema) {}
