import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const UserQuerySchema = PaginationQuerySchema.extend({
  username: z.string().optional(),
  nickname: z.string().optional(),
  mobile: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
  deptId: z.coerce.number().int().optional(),
});

export class UserQueryDto extends createZodDto(UserQuerySchema) {}
