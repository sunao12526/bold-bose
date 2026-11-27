import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const mobileRegex = /^1\d{10}$/;

export const AppMemberLoginSchema = z.object({
  mobile: z.string({ error: '手机号不能为空' }).regex(mobileRegex, '请输入有效的 11 位手机号'),
  password: z.string({ error: '密码不能为空' }).min(1, '密码不能为空'),
});
export class AppMemberLoginDto extends createZodDto(AppMemberLoginSchema) {}

export const AppMemberSendSmsCodeSchema = z.object({
  mobile: z.string({ error: '手机号不能为空' }).regex(mobileRegex, '请输入有效的 11 位手机号'),
  scene: z.coerce.number().int().min(1).max(10).optional().default(1),
});
export class AppMemberSendSmsCodeDto extends createZodDto(AppMemberSendSmsCodeSchema) {}

export const AppMemberSmsLoginSchema = z.object({
  mobile: z.string({ error: '手机号不能为空' }).regex(mobileRegex, '请输入有效的 11 位手机号'),
  code: z.string({ error: '短信验证码不能为空' }).min(4, '验证码格式不正确'),
});
export class AppMemberSmsLoginDto extends createZodDto(AppMemberSmsLoginSchema) {}

export const AppMemberRefreshTokenSchema = z.object({
  refreshToken: z.string({ error: 'refreshToken 不能为空' }).min(1),
});
export class AppMemberRefreshTokenDto extends createZodDto(AppMemberRefreshTokenSchema) {}

export const AppMemberUpdateProfileSchema = z.object({
  nickname: z.string({ error: '昵称不能为空' }).min(1).max(50),
  avatar: z.string().max(512).nullable().optional(),
});
export class AppMemberUpdateProfileDto extends createZodDto(AppMemberUpdateProfileSchema) {}

export const AppMemberUpdateMobileSchema = z.object({
  mobile: z.string({ error: '新手机号不能为空' }).regex(mobileRegex, '请输入有效的 11 位手机号'),
  code: z.string({ error: '短信验证码不能为空' }).min(4),
});
export class AppMemberUpdateMobileDto extends createZodDto(AppMemberUpdateMobileSchema) {}

export const AppMemberUpdatePasswordSchema = z.object({
  code: z.string({ error: '短信验证码不能为空' }).min(4),
  password: z.string({ error: '新密码不能为空' }).min(6, '新密码至少 6 个字符').max(50),
});
export class AppMemberUpdatePasswordDto extends createZodDto(AppMemberUpdatePasswordSchema) {}

export const AppMemberCreateAddressSchema = z.object({
  name: z.string({ error: '收件人姓名不能为空' }).min(1).max(50),
  mobile: z.string({ error: '手机号不能为空' }).regex(mobileRegex, '请输入有效的 11 位手机号'),
  areaId: z.coerce.number().int().nullable().optional(),
  detailAddress: z.string({ error: '详细地址不能为空' }).min(1).max(512),
  defaultStatus: z.boolean().optional().default(false),
});
export class AppMemberCreateAddressDto extends createZodDto(AppMemberCreateAddressSchema) {}

export const AppMemberUpdateAddressSchema = AppMemberCreateAddressSchema.partial().extend({
  id: z.coerce.number().int(),
});
export class AppMemberUpdateAddressDto extends createZodDto(AppMemberUpdateAddressSchema) {}
