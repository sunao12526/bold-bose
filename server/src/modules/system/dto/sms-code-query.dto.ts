import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const SmsCodeQuerySchema = PaginationQuerySchema.extend({
  mobile: z.string().optional(),
  used: z.string().optional(),
});

export class SmsCodeQueryDto extends createZodDto(SmsCodeQuerySchema) {}
