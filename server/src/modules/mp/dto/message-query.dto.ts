import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const MessageQuerySchema = PaginationQuerySchema.extend({
  accountId: z.coerce.number().int().optional(),
  type: z.string().optional(),
  openid: z.string().optional(),
});

export class MessageQueryDto extends createZodDto(MessageQuerySchema) {}
