import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { MallOrderStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../../shared/dto/pagination.dto';

export const OrderQuerySchema = PaginationQuerySchema.extend({
  no: z.string().optional(),
  status: z.enum(MallOrderStatus).optional(),
});

export class OrderQueryDto extends createZodDto(OrderQuerySchema) {}
