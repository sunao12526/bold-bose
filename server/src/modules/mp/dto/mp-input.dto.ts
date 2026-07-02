import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

// MpAccount
export const CreateMpAccountSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(100).describe('公众号名称'),
  account: z.string().min(1, '微信号不能为空').max(100).describe('公众号微信号'),
  appId: z.string().min(1, 'appId 不能为空').max(100).describe('公众号 appId'),
  appSecret: z.string().min(1, 'appSecret 不能为空').max(200).describe('公众号 appSecret'),
  token: z.string().min(1, 'token 不能为空').max(100).describe('公众号 Token'),
  aesKey: z.string().max(200).nullable().optional().describe('消息加解密密钥 (EncodingAESKey)'),
  qrCodeUrl: z.string().url().nullable().optional().describe('公众号二维码图片 URL'),
  remark: z.string().nullable().optional().describe('备注'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态'),
});
export class CreateMpAccountDto extends createZodDto(CreateMpAccountSchema) {}

export const UpdateMpAccountSchema = CreateMpAccountSchema.partial();
export class UpdateMpAccountDto extends createZodDto(UpdateMpAccountSchema) {}

// MpAutoReply
export const CreateMpAutoReplySchema = z.object({
  accountId: z.number().int().describe('所属公众号账号 ID'),
  type: z.number().int().describe('回复类型 (1: 关键字回复, 2: 关注时回复)'),
  requestKeyword: z.string().max(200).nullable().optional().describe('请求的关键字'),
  requestMatch: z.number().int().default(1).optional().describe('匹配方式 (1: 全匹配, 2: 半匹配)'),
  requestMessageType: z.string().max(30).nullable().optional().describe('请求消息类型'),
  responseMessageType: z.string().max(30).describe('回复消息类型'),
  responseContent: z.string().nullable().optional().describe('回复内容 (文字消息)'),
  responseMediaId: z.string().max(200).nullable().optional().describe('回复素材的 mediaId'),
  responseMediaUrl: z.string().max(500).nullable().optional().describe('回复素材图片等访问 URL'),
  responseArticles: z.any().optional().describe('图文消息详情数组 (JSON 格式)'),
  sort: z.number().int().default(0).describe('排序'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态'),
});
export class CreateMpAutoReplyDto extends createZodDto(CreateMpAutoReplySchema) {}

export const UpdateMpAutoReplySchema = CreateMpAutoReplySchema.partial();
export class UpdateMpAutoReplyDto extends createZodDto(UpdateMpAutoReplySchema) {}

// MpMaterial
export const CreateMpMaterialSchema = z.object({
  accountId: z.number().int().describe('公众号账号 ID'),
  mediaId: z.string().min(1, 'mediaId 不能为空').max(200).describe('微信素材 mediaId'),
  type: z.string().max(20).describe('素材类型 (image, video, voice, news)'),
  permanent: z.boolean().default(true).describe('是否永久素材'),
  url: z.string().url().describe('素材访问链接'),
  name: z.string().max(200).nullable().optional().describe('素材名称 / 文件名'),
  mpUrl: z.string().url().nullable().optional().describe('微信端访问链接'),
  title: z.string().max(200).nullable().optional().describe('图文素材标题'),
  introduction: z.string().max(500).nullable().optional().describe('素材说明/简介'),
});
export class CreateMpMaterialDto extends createZodDto(CreateMpMaterialSchema) {}

export const UpdateMpMaterialSchema = CreateMpMaterialSchema.partial();
export class UpdateMpMaterialDto extends createZodDto(UpdateMpMaterialSchema) {}

// MpMenu
export const CreateMpMenuSchema = z.object({
  accountId: z.number().int().describe('公众号账号 ID'),
  name: z.string().min(1, '菜单名不能为空').max(50).describe('菜单标题名称'),
  menuKey: z.string().max(100).nullable().optional().describe('菜单 Key'),
  parentId: z.number().int().default(0).describe('父菜单 ID'),
  type: z.string().max(30).nullable().optional().describe('菜单动作类型 (e.g. click, view, miniprogram)'),
  url: z.string().nullable().optional().describe('网页链接地址'),
  miniProgramAppId: z.string().max(100).nullable().optional().describe('小程序的 appId'),
  miniProgramPagePath: z.string().max(200).nullable().optional().describe('小程序的页面路径'),
  replyMessageType: z.string().max(30).nullable().optional().describe('回复消息类型'),
  replyContent: z.string().nullable().optional().describe('回复消息正文'),
  replyMediaId: z.string().max(200).nullable().optional().describe('回复消息素材 ID'),
  sort: z.number().int().default(0).describe('排序排序'),
});
export class CreateMpMenuDto extends createZodDto(CreateMpMenuSchema) {}

export const UpdateMpMenuSchema = CreateMpMenuSchema.partial();
export class UpdateMpMenuDto extends createZodDto(UpdateMpMenuSchema) {}

// MpTag
export const CreateMpTagSchema = z.object({
  accountId: z.number().int().describe('公众号账号 ID'),
  tagId: z.number().int().describe('微信端标签 ID'),
  name: z.string().min(1, '标签名称不能为空').max(50).describe('标签名称'),
  count: z.number().int().default(0).describe('该标签下的粉丝数'),
});
export class CreateMpTagDto extends createZodDto(CreateMpTagSchema) {}

export const UpdateMpTagSchema = CreateMpTagSchema.partial();
export class UpdateMpTagDto extends createZodDto(UpdateMpTagSchema) {}
