import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const MailLogQuerySchema = PaginationQuerySchema.extend({
  receiver: z.string().optional(),
  status: z.string().optional(),
  templateId: z.coerce.number().int().optional(),
});

export class MailLogQueryDto extends createZodDto(MailLogQuerySchema) {}
