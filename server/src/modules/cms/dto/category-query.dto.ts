import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const CategoryQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  code: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});

export class CategoryQueryDto extends createZodDto(CategoryQuerySchema) {}
