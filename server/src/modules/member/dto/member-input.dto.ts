import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const MemberQuerySchema = z.object({
  nickname: z.string().optional().describe('会员昵称模糊匹配'),
  mobile: z.string().optional().describe('会员手机号'),
  status: z.enum(CommonStatus).optional().describe('帐号状态'),
  levelId: z.string().optional().describe('等级 ID'),
  groupId: z.string().optional().describe('分组 ID'),
  page: z.string().optional().describe('页码 (从1开始)'),
  pageSize: z.string().optional().describe('每页条数'),
});
export class MemberQueryDto extends createZodDto(MemberQuerySchema) {}

export const UpdateMemberStatusSchema = z.object({
  status: z.enum(CommonStatus).describe('修改后状态'),
});
export class UpdateMemberStatusDto extends createZodDto(UpdateMemberStatusSchema) {}

export const AdjustAmountSchema = z.object({
  amount: z.number().int().describe('调整值 (可为正数或负数)'),
});
export class AdjustAmountDto extends createZodDto(AdjustAmountSchema) {}

export const AssignTagsSchema = z.object({
  tagIds: z.array(z.number().int()).describe('会员标签 ID 数组'),
});
export class AssignTagsDto extends createZodDto(AssignTagsSchema) {}

export const AssignGroupSchema = z.object({
  groupId: z.number().int().nullable().describe('会员分组 ID，传 null 表示取消分组'),
});
export class AssignGroupDto extends createZodDto(AssignGroupSchema) {}

export const AssignLevelSchema = z.object({
  levelId: z.number().int().nullable().describe('会员等级 ID，传 null 表示取消自定义等级'),
});
export class AssignLevelDto extends createZodDto(AssignLevelSchema) {}

// Level
export const CreateLevelSchema = z.object({
  name: z.string().min(1, '等级名称不能为空').max(50, '等级名称不能超过50个字符').describe('等级名称'),
  experience: z.number().int().nonnegative('成长值底线不能为负数').describe('所需成长值'),
  discountPercent: z.number().int().min(1).max(100).default(100).describe('享有的折扣百分比 (e.g. 95)'),
  iconUrl: z.string().url().nullable().optional().describe('等级图标 URL'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态'),
});
export class CreateLevelDto extends createZodDto(CreateLevelSchema) {}

export const UpdateLevelSchema = CreateLevelSchema.partial();
export class UpdateLevelDto extends createZodDto(UpdateLevelSchema) {}

// Tag
export const CreateTagSchema = z.object({
  name: z.string().min(1, '标签名不能为空').max(50).describe('标签名称'),
});
export class CreateMemberTagDto extends createZodDto(CreateTagSchema) {}

export const UpdateTagSchema = CreateTagSchema.partial();
export class UpdateMemberTagDto extends createZodDto(UpdateTagSchema) {}

// SignInConfig
export const UpdateSignInConfigSchema = z.object({
  point: z.number().int().nonnegative('赠送积分不能小于0').describe('签到赠送的积分值'),
  status: z.enum(CommonStatus).describe('配置状态'),
});
export class UpdateSignInConfigDto extends createZodDto(UpdateSignInConfigSchema) {}

// SignInRecordQuery
export const SignInRecordQuerySchema = z.object({
  userId: z.string().optional().describe('会员 ID'),
  page: z.string().optional().describe('页码'),
  pageSize: z.string().optional().describe('每页条数'),
});
export class SignInRecordQueryDto extends createZodDto(SignInRecordQuerySchema) {}

// Group
export const CreateGroupSchema = z.object({
  name: z.string().min(1, '分组名称不能为空').max(50).describe('分组名称'),
  status: z.enum(CommonStatus).default('ENABLE').describe('分组状态'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateGroupDto extends createZodDto(CreateGroupSchema) {}

export const UpdateGroupSchema = CreateGroupSchema.partial();
export class UpdateGroupDto extends createZodDto(UpdateGroupSchema) {}

// Address
export const CreateAddressSchema = z.object({
  userId: z.number().int().describe('会员 ID'),
  name: z.string().min(1, '收货人姓名不能为空').max(50).describe('收货人姓名'),
  mobile: z.string().min(1, '收货人手机号不能为空').describe('收货人手机'),
  areaId: z.number().int().describe('收货地区 ID'),
  detailAddress: z.string().min(1, '详细地址不能为空').describe('详细地址'),
  isDefault: z.boolean().default(false).describe('是否为默认收货地址'),
});
export class CreateAddressDto extends createZodDto(CreateAddressSchema) {}

export const UpdateAddressSchema = CreateAddressSchema.partial();
export class UpdateAddressDto extends createZodDto(UpdateAddressSchema) {}

// Config
export const SaveConfigSchema = z.object({
  tradePointCashPercent: z.number().int().min(0).max(100).optional().describe('积分抵扣上限比例百分比'),
  tradePointGivePercent: z.number().int().min(0).optional().describe('消费 1 元赠送积分数'),
  signInPoint: z.number().int().min(0).optional().describe('签到赠送基础积分'),
});
export class SaveConfigDto extends createZodDto(SaveConfigSchema) {}
