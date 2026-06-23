import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const BannerQuerySchema = PaginationQuerySchema.extend({
  title: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});

export class BannerQueryDto extends createZodDto(BannerQuerySchema) {}
