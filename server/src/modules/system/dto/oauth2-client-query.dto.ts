import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

export const OAuth2ClientQuerySchema = PaginationQuerySchema.extend({
  clientId: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
});

export class OAuth2ClientQueryDto extends createZodDto(OAuth2ClientQuerySchema) {}
