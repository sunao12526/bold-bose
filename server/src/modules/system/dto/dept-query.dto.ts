import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const DeptQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  status: z.string().optional(),
});

export class DeptQueryDto extends createZodDto(DeptQuerySchema) {}
