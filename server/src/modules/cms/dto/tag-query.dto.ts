import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const TagQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});

export class TagQueryDto extends createZodDto(TagQuerySchema) {}
