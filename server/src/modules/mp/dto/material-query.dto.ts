import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const MaterialQuerySchema = PaginationQuerySchema.extend({
  accountId: z.coerce.number().int().optional(),
  type: z.string().optional(),
});

export class MaterialQueryDto extends createZodDto(MaterialQuerySchema) {}
