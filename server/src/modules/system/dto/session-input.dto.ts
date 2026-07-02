import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UserSessionQuerySchema = z.object({
  username: z.string().optional().describe('用户名模糊匹配'),
  ip: z.string().optional().describe('登录 IP 模糊匹配'),
});
export class UserSessionQueryDto extends createZodDto(UserSessionQuerySchema) {}
