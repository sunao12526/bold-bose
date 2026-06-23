import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LoginSchema = z.object({
  username: z.string({ error: '用户名不能为空' }).min(1, '用户名不能为空'),
  password: z.string({ error: '密码不能为空' }).min(1, '密码不能为空'),
  captchaKey: z.string({ error: '验证码标识不能为空' }).min(1, '验证码标识不能为空'),
  captchaCode: z.string({ error: '验证码不能为空' }).min(1, '验证码不能为空'),
});

export class LoginDto extends createZodDto(LoginSchema) {}
