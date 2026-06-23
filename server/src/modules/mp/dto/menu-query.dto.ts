import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const MenuQuerySchema = PaginationQuerySchema.extend({
  accountId: z.coerce.number().int().optional(),
});

export class MenuQueryDto extends createZodDto(MenuQuerySchema) {}
