import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const AutoReplyQuerySchema = PaginationQuerySchema.extend({
  accountId: z.coerce.number().int().optional(),
  type: z.coerce.number().int().optional(),
});

export class AutoReplyQueryDto extends createZodDto(AutoReplyQuerySchema) {}
