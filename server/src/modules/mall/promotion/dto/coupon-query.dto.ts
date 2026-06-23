import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../../shared/dto/pagination.dto';

export const CouponQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});

export class CouponQueryDto extends createZodDto(CouponQuerySchema) {}
