import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../../shared/dto/pagination.dto';

export const SocialClientQuerySchema = PaginationQuerySchema.extend({
  type: z.string().optional().describe('社交平台类型'),
  status: z.enum(['ENABLE', 'DISABLE']).optional().describe('状态'),
});
export class SocialClientQueryDto extends createZodDto(SocialClientQuerySchema) {}

export const CreateSocialClientSchema = z.object({
  type: z.string({ error: '平台类型不能为空' }).min(1).max(50),
  clientId: z.string({ error: 'Client ID 不能为空' }).min(1).max(100),
  clientSecret: z.string({ error: 'Client Secret 不能为空' }).min(1).max(100),
  redirectUri: z.string({ error: '回调地址不能为空' }).min(1).max(200),
  status: z.enum(['ENABLE', 'DISABLE']).optional().default('ENABLE'),
});
export class CreateSocialClientDto extends createZodDto(CreateSocialClientSchema) {}

export const UpdateSocialClientSchema = z.object({
  type: z.string().min(1).max(50).optional(),
  clientId: z.string().min(1).max(100).optional(),
  clientSecret: z.string().min(1).max(100).optional(),
  redirectUri: z.string().min(1).max(200).optional(),
  status: z.enum(['ENABLE', 'DISABLE']).optional(),
});
export class UpdateSocialClientDto extends createZodDto(UpdateSocialClientSchema) {}

export const SocialUserQuerySchema = PaginationQuerySchema.extend({
  type: z.string().optional().describe('社交平台类型'),
  nickname: z.string().optional().describe('社交昵称'),
  openid: z.string().optional().describe('OpenID'),
  userId: z.coerce.number().int().optional().describe('关联系统用户 ID'),
});
export class SocialUserQueryDto extends createZodDto(SocialUserQuerySchema) {}
