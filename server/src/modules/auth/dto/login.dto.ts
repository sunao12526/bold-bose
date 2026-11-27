import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LoginSchema = z.object({
  username: z.string({ error: '用户名不能为空' }).min(1, '用户名不能为空'),
  password: z.string({ error: '密码不能为空' }).min(1, '密码不能为空'),
  captchaKey: z.string({ error: '验证码标识不能为空' }).min(1, '验证码标识不能为空'),
  captchaCode: z.string({ error: '验证码不能为空' }).min(1, '验证码不能为空'),
});
export class LoginDto extends createZodDto(LoginSchema) {}

export const SendSmsCodeSchema = z.object({
  mobile: z
    .string({ error: '手机号不能为空' })
    .regex(/^1\d{10}$/, '请输入有效的 11 位手机号'),
  scene: z.coerce.number().int().min(1).max(10).optional().default(1),
});
export class SendSmsCodeDto extends createZodDto(SendSmsCodeSchema) {}

export const SmsLoginSchema = z.object({
  mobile: z
    .string({ error: '手机号不能为空' })
    .regex(/^1\d{10}$/, '请输入有效的 11 位手机号'),
  code: z.string({ error: '短信验证码不能为空' }).min(4, '短信验证码格式不正确'),
});
export class SmsLoginDto extends createZodDto(SmsLoginSchema) {}

export const RegisterSchema = z.object({
  username: z
    .string({ error: '用户名不能为空' })
    .min(3, '用户名至少 3 个字符')
    .max(50, '用户名最多 50 个字符'),
  password: z
    .string({ error: '密码不能为空' })
    .min(6, '密码至少 6 个字符')
    .max(50, '密码最多 50 个字符'),
  nickname: z.string().min(1).max(50).optional(),
  captchaKey: z.string({ error: '验证码标识不能为空' }).min(1, '验证码标识不能为空'),
  captchaCode: z.string({ error: '验证码不能为空' }).min(1, '验证码不能为空'),
});
export class RegisterDto extends createZodDto(RegisterSchema) {}

export const ResetPasswordSchema = z.object({
  mobile: z
    .string({ error: '手机号不能为空' })
    .regex(/^1\d{10}$/, '请输入有效的 11 位手机号'),
  code: z.string({ error: '短信验证码不能为空' }).min(4, '短信验证码格式不正确'),
  password: z
    .string({ error: '新密码不能为空' })
    .min(6, '新密码至少 6 个字符')
    .max(50, '新密码最多 50 个字符'),
});
export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}

export const RefreshTokenSchema = z.object({
  refreshToken: z.string({ error: 'refreshToken 不能为空' }).min(1, 'refreshToken 不能为空'),
});
export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
