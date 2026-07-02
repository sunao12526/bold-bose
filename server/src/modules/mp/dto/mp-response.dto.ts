import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const MpAccountResponseSchema = z.object({
  id: z.number().int().describe('账号自增 ID'),
  name: z.string().describe('公众号名称'),
  account: z.string().describe('公众号微信号'),
  appId: z.string().describe('公众号 appId'),
  token: z.string().describe('Token'),
  aesKey: z.string().nullable().describe('EncodingAESKey'),
  qrCodeUrl: z.string().nullable().describe('二维码 URL'),
  remark: z.string().nullable().describe('备注'),
  status: z.enum(CommonStatus).describe('启用状态'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MpAccountResponseDto extends createZodDto(MpAccountResponseSchema) {}

export const MpMaterialResponseSchema = z.object({
  id: z.number().int().describe('素材自增 ID'),
  accountId: z.number().int().describe('所属公众号 ID'),
  appId: z.string().describe('appId'),
  mediaId: z.string().describe('微信 mediaId'),
  type: z.string().describe('素材类型'),
  permanent: z.boolean().describe('是否永久素材'),
  url: z.string().describe('素材访问链接'),
  name: z.string().nullable().describe('文件名'),
  mpUrl: z.string().nullable().describe('微信链接'),
  title: z.string().nullable().describe('图文标题'),
  introduction: z.string().nullable().describe('简介说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MpMaterialResponseDto extends createZodDto(MpMaterialResponseSchema) {}

export const MpMaterialListResponseSchema = z.object({
  items: z.array(MpMaterialResponseSchema).describe('微信素材数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class MpMaterialListResponseDto extends createZodDto(MpMaterialListResponseSchema) {}

export const MpMenuResponseSchema = z.object({
  id: z.number().int().describe('菜单自增 ID'),
  accountId: z.number().int().describe('所属公众号 ID'),
  appId: z.string().describe('appId'),
  name: z.string().describe('菜单标题'),
  menuKey: z.string().nullable().describe('菜单 Key'),
  parentId: z.number().int().nullable().describe('父级菜单 ID'),
  type: z.string().nullable().describe('动作类型'),
  url: z.string().nullable().describe('网页链接'),
  miniProgramAppId: z.string().nullable().describe('小程序 appId'),
  miniProgramPagePath: z.string().nullable().describe('小程序页面'),
  replyMessageType: z.string().nullable().describe('自动回复消息类型'),
  replyContent: z.string().nullable().describe('自动回复消息正文'),
  replyMediaId: z.string().nullable().describe('自动回复素材 mediaId'),
  sort: z.number().int().describe('显示顺序'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MpMenuResponseDto extends createZodDto(MpMenuResponseSchema) {}

export const MpMenuListResponseSchema = z.object({
  items: z.array(MpMenuResponseSchema).describe('菜单数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class MpMenuListResponseDto extends createZodDto(MpMenuListResponseSchema) {}

export const MpAutoReplyResponseSchema = z.object({
  id: z.number().int().describe('自增 ID'),
  accountId: z.number().int().describe('公众号 ID'),
  appId: z.string().describe('appId'),
  type: z.number().int().describe('回复类型'),
  requestKeyword: z.string().nullable().describe('关键字匹配词'),
  requestMatch: z.number().int().describe('关键字匹配方式'),
  requestMessageType: z.string().nullable().describe('请求消息类型'),
  responseMessageType: z.string().describe('回复消息类型'),
  responseContent: z.string().nullable().describe('文字回复内容'),
  responseMediaId: z.string().nullable().describe('素材 mediaId'),
  responseMediaUrl: z.string().nullable().describe('素材链接地址'),
  responseArticles: z.any().nullable().describe('文章列表图文 JSON'),
  sort: z.number().int().describe('排序'),
  status: z.enum(CommonStatus).describe('启用状态'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MpAutoReplyResponseDto extends createZodDto(MpAutoReplyResponseSchema) {}

export const MpAutoReplyListResponseSchema = z.object({
  items: z.array(MpAutoReplyResponseSchema).describe('自动回复数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class MpAutoReplyListResponseDto extends createZodDto(MpAutoReplyListResponseSchema) {}

export const MpUserResponseSchema = z.object({
  id: z.number().int().describe('粉丝用户自增 ID'),
  accountId: z.number().int().describe('所属公众号 ID'),
  appId: z.string().describe('appId'),
  openid: z.string().describe('OpenID'),
  unionid: z.string().nullable().describe('UnionID'),
  subscribeStatus: z.number().int().describe('关注状态 (0: 取消关注, 1: 关注中)'),
  subscribeTime: z.string().nullable().describe('关注时间'),
  unsubscribeTime: z.string().nullable().describe('取消关注时间'),
  nickname: z.string().nullable().describe('微信昵称'),
  headImageUrl: z.string().nullable().describe('微信头像'),
  language: z.string().nullable().describe('语言'),
  country: z.string().nullable().describe('国家'),
  province: z.string().nullable().describe('省份'),
  city: z.string().nullable().describe('城市'),
  remark: z.string().nullable().describe('粉丝备注'),
  tagIds: z.any().nullable().describe('标签 ID 列表 JSON'),
  sex: z.number().int().nullable().describe('性别 (0: 未知, 1: 男, 2: 女)'),
  createdAt: z.string().describe('记录创建时间'),
  updatedAt: z.string().describe('记录更新时间'),
});
export class MpUserResponseDto extends createZodDto(MpUserResponseSchema) {}

export const MpUserListResponseSchema = z.object({
  items: z.array(MpUserResponseSchema).describe('粉丝用户数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class MpUserListResponseDto extends createZodDto(MpUserListResponseSchema) {}

export const MpTagResponseSchema = z.object({
  id: z.number().int().describe('标签自增 ID'),
  accountId: z.number().int().describe('所属公众号 ID'),
  appId: z.string().describe('appId'),
  tagId: z.number().int().describe('微信端标签 ID'),
  name: z.string().describe('微信标签名'),
  count: z.number().int().describe('粉丝数数量'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MpTagResponseDto extends createZodDto(MpTagResponseSchema) {}

export const MpTagListResponseSchema = z.object({
  items: z.array(MpTagResponseSchema).describe('微信标签数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class MpTagListResponseDto extends createZodDto(MpTagListResponseSchema) {}

export const MpMessageResponseSchema = z.object({
  id: z.number().int().describe('消息自增 ID'),
  msgId: z.string().nullable().describe('微信端消息唯一 ID'),
  accountId: z.number().int().describe('所属公众号 ID'),
  appId: z.string().describe('appId'),
  userId: z.number().int().nullable().describe('会员 ID'),
  openid: z.string().describe('粉丝 OpenID'),
  type: z.string().describe('消息内容类型 (text, image, event 等)'),
  sendFrom: z.number().int().describe('发送来源 (1: 粉丝发送, 2: 公众号回复)'),
  content: z.string().nullable().describe('消息正文'),
  mediaId: z.string().nullable().describe('微信 mediaId'),
  mediaUrl: z.string().nullable().describe('微信素材下载链接'),
  title: z.string().nullable().describe('链接/视频消息标题'),
  url: z.string().nullable().describe('事件网页链接'),
  event: z.string().nullable().describe('微信事件名称 (subscribe, click 等)'),
  eventKey: z.string().nullable().describe('事件 Key 关联值'),
  createdAt: z.string().describe('发送时间'),
});
export class MpMessageResponseDto extends createZodDto(MpMessageResponseSchema) {}

export const MpMessageListResponseSchema = z.object({
  items: z.array(MpMessageResponseSchema).describe('微信消息数据历史列表'),
  total: z.number().int().describe('总记录数'),
});
export class MpMessageListResponseDto extends createZodDto(MpMessageListResponseSchema) {}
