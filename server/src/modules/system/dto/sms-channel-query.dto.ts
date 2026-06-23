import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const SmsChannelQuerySchema = PaginationQuerySchema.extend({
  code: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
});

export class SmsChannelQueryDto extends createZodDto(SmsChannelQuerySchema) {}
