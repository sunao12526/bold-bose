import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const MailAccountQuerySchema = PaginationQuerySchema.extend({
  mail: z.string().optional(),
  username: z.string().optional(),
  status: z.string().optional(),
});

export class MailAccountQueryDto extends createZodDto(MailAccountQuerySchema) {}
