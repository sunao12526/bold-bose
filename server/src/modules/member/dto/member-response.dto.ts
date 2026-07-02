import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const MemberLevelResponseSchema = z.object({
  id: z.number().int().describe('等级 ID'),
  name: z.string().describe('等级名称'),
  experience: z.number().int().describe('所需成长值'),
  discountPercent: z.number().int().describe('折扣比例'),
  iconUrl: z.string().nullable().describe('等级图标 URL'),
  status: z.enum(CommonStatus).describe('状态'),
});
export class MemberLevelResponseDto extends createZodDto(MemberLevelResponseSchema) {}

export const MemberGroupResponseSchema = z.object({
  id: z.number().int().describe('分组 ID'),
  name: z.string().describe('分组名称'),
  status: z.enum(CommonStatus).describe('状态'),
  remark: z.string().nullable().describe('备注说明'),
});
export class MemberGroupResponseDto extends createZodDto(MemberGroupResponseSchema) {}

export const MemberResponseSchema = z.object({
  id: z.number().int().describe('会员 ID'),
  nickname: z.string().describe('昵称'),
  avatarUrl: z.string().nullable().describe('头像 URL'),
  mobile: z.string().describe('手机号'),
  status: z.enum(CommonStatus).describe('状态'),
  points: z.number().int().describe('积分'),
  balance: z.number().int().describe('余额 (分)'),
  experience: z.number().int().describe('成长值'),
  levelId: z.number().int().nullable().describe('等级 ID'),
  groupId: z.number().int().nullable().describe('分组 ID'),
  level: MemberLevelResponseSchema.nullable().optional().describe('等级详情'),
  group: MemberGroupResponseSchema.nullable().optional().describe('分组详情'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MemberResponseDto extends createZodDto(MemberResponseSchema) {}

export const MemberListResponseSchema = z.object({
  items: z.array(MemberResponseSchema).describe('会员列表数据'),
  total: z.number().int().describe('总数'),
});
export class MemberListResponseDto extends createZodDto(MemberListResponseSchema) {}

export const MemberTagResponseSchema = z.object({
  id: z.number().int().describe('标签 ID'),
  name: z.string().describe('标签名称'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MemberTagResponseDto extends createZodDto(MemberTagResponseSchema) {}

export const MemberSignInConfigResponseSchema = z.object({
  id: z.number().int().describe('配置 ID'),
  day: z.number().int().describe('签到第几天'),
  point: z.number().int().describe('赠送的积分值'),
  status: z.enum(CommonStatus).describe('状态'),
});
export class MemberSignInConfigResponseDto extends createZodDto(MemberSignInConfigResponseSchema) {}

export const MemberSignInRecordResponseSchema = z.object({
  id: z.number().int().describe('记录 ID'),
  userId: z.number().int().describe('会员 ID'),
  day: z.number().int().describe('签到天数第几天'),
  point: z.number().int().describe('本次签到赠送积分'),
  createdAt: z.string().describe('签到时间'),
});
export class MemberSignInRecordResponseDto extends createZodDto(MemberSignInRecordResponseSchema) {}

export const MemberSignInRecordListResponseSchema = z.object({
  items: z.array(MemberSignInRecordResponseSchema).describe('签到记录列表'),
  total: z.number().int().describe('总记录数'),
});
export class MemberSignInRecordListResponseDto extends createZodDto(MemberSignInRecordListResponseSchema) {}

export const MemberPointRecordResponseSchema = z.object({
  id: z.number().int().describe('记录 ID'),
  userId: z.number().int().describe('会员 ID'),
  title: z.string().describe('记录标题'),
  description: z.string().nullable().describe('详细描述'),
  amount: z.number().int().describe('积分变化值'),
  postPoints: z.number().int().describe('变动后总积分'),
  operatorId: z.string().nullable().describe('操作人 ID'),
  createdAt: z.string().describe('记录时间'),
});
export class MemberPointRecordResponseDto extends createZodDto(MemberPointRecordResponseSchema) {}

export const MemberPointRecordListResponseSchema = z.object({
  items: z.array(MemberPointRecordResponseSchema).describe('积分变动记录列表'),
  total: z.number().int().describe('总记录数'),
});
export class MemberPointRecordListResponseDto extends createZodDto(MemberPointRecordListResponseSchema) {}

export const MemberBalanceRecordResponseSchema = z.object({
  id: z.number().int().describe('记录 ID'),
  userId: z.number().int().describe('会员 ID'),
  title: z.string().describe('记录标题'),
  description: z.string().nullable().describe('详细描述'),
  amount: z.number().int().describe('余额变化值 (分)'),
  postBalance: z.number().int().describe('变动后总余额 (分)'),
  operatorId: z.string().nullable().describe('操作人 ID'),
  createdAt: z.string().describe('记录时间'),
});
export class MemberBalanceRecordResponseDto extends createZodDto(MemberBalanceRecordResponseSchema) {}

export const MemberBalanceRecordListResponseSchema = z.object({
  items: z.array(MemberBalanceRecordResponseSchema).describe('余额变动记录列表'),
  total: z.number().int().describe('总记录数'),
});
export class MemberBalanceRecordListResponseDto extends createZodDto(MemberBalanceRecordListResponseSchema) {}

export const MemberAddressResponseSchema = z.object({
  id: z.number().int().describe('收货地址 ID'),
  userId: z.number().int().describe('会员 ID'),
  name: z.string().describe('收货人姓名'),
  mobile: z.string().describe('收货人手机'),
  areaId: z.number().int().describe('收货地区 ID'),
  detailAddress: z.string().describe('详细地址'),
  isDefault: z.boolean().describe('是否默认地址'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MemberAddressResponseDto extends createZodDto(MemberAddressResponseSchema) {}

export const MemberConfigResponseSchema = z.object({
  id: z.number().int().describe('配置 ID'),
  tradePointCashPercent: z.number().int().describe('积分抵扣比例'),
  tradePointGivePercent: z.number().int().describe('积分赠送比例'),
  signInPoint: z.number().int().describe('签到赠送积分'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MemberConfigResponseDto extends createZodDto(MemberConfigResponseSchema) {}

export const MemberExperienceRecordResponseSchema = z.object({
  id: z.number().int().describe('记录 ID'),
  userId: z.number().int().describe('会员 ID'),
  title: z.string().describe('变动标题'),
  description: z.string().nullable().describe('详细描述'),
  amount: z.number().int().describe('变动成长值'),
  postExperience: z.number().int().describe('变动后总成长值'),
  operatorId: z.string().nullable().describe('操作人 ID'),
  createdAt: z.string().describe('变动时间'),
});
export class MemberExperienceRecordResponseDto extends createZodDto(MemberExperienceRecordResponseSchema) {}

export const MemberExperienceRecordListResponseSchema = z.object({
  items: z.array(MemberExperienceRecordResponseSchema).describe('成长值变动记录列表'),
  total: z.number().int().describe('总记录数'),
});
export class MemberExperienceRecordListResponseDto extends createZodDto(MemberExperienceRecordListResponseSchema) {}

export const MemberLevelRecordResponseSchema = z.object({
  id: z.number().int().describe('等级变更记录 ID'),
  userId: z.number().int().describe('会员 ID'),
  preLevelId: z.number().int().nullable().describe('变动前等级 ID'),
  postLevelId: z.number().int().nullable().describe('变动后等级 ID'),
  experience: z.number().int().describe('变动时成长值'),
  remark: z.string().nullable().describe('变更备注'),
  operatorId: z.string().nullable().describe('操作人 ID'),
  createdAt: z.string().describe('记录时间'),
});
export class MemberLevelRecordResponseDto extends createZodDto(MemberLevelRecordResponseSchema) {}

export const MemberLevelRecordListResponseSchema = z.object({
  items: z.array(MemberLevelRecordResponseSchema).describe('等级变更记录列表'),
  total: z.number().int().describe('总记录数'),
});
export class MemberLevelRecordListResponseDto extends createZodDto(MemberLevelRecordListResponseSchema) {}
