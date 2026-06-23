import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const UserQuerySchema = PaginationQuerySchema.extend({
  accountId: z.coerce.number().int().optional(),
  keyword: z.string().optional(),
  subscribeStatus: z.coerce.number().int().optional(),
});

export class UserQueryDto extends createZodDto(UserQuerySchema) {}
