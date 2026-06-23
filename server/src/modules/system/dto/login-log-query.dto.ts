import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const LoginLogQuerySchema = PaginationQuerySchema.extend({
  username: z.string().optional(),
  status: z.string().optional(),
});

export class LoginLogQueryDto extends createZodDto(LoginLogQuerySchema) {}
