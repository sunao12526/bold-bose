import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const SmsLogQuerySchema = PaginationQuerySchema.extend({
  mobile: z.string().optional(),
  status: z.string().optional(),
  templateId: z.coerce.number().int().optional(),
});

export class SmsLogQueryDto extends createZodDto(SmsLogQuerySchema) {}
