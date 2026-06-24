import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { MallRefundStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../../shared/dto/pagination.dto';

export const RefundQuerySchema = PaginationQuerySchema.extend({
  status: z.any().optional(),
  memberId: z.coerce.number().optional(),
});

export class RefundQueryDto extends createZodDto(RefundQuerySchema) {}
