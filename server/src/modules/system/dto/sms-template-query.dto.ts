import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const SmsTemplateQuerySchema = PaginationQuerySchema.extend({
  code: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
});

export class SmsTemplateQueryDto extends createZodDto(SmsTemplateQuerySchema) {}
