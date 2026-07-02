import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';

@Injectable()
export class MpMessageService {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    if (query?.type) where.type = query.type;
    if (query?.openid) where.openid = { contains: query.openid };
    return this.prisma.mpMessage.findMany({ where, orderBy: { id: 'desc' }, take: 200 });
  }

  async findOne(id: number) {
    return this.prisma.mpMessage.findUnique({ where: { id } });
  }

  /**
   * 发送客服消息并入库
   */
  async sendKefuMessage(data: {
    accountId: number;
    openid: string;
    type: string;
    content: string;
    mediaId?: string;
  }) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: data.accountId } });
    if (!account) throw new NotFoundException('公众号账号不存在');

    // 格式化微信所需的 payload
    let payloadContent: any = {};
    if (data.type === 'text') {
      payloadContent = { text: { content: data.content } };
    } else if (data.type === 'image') {
      payloadContent = { image: { media_id: data.mediaId } };
    } else if (data.type === 'voice') {
      payloadContent = { voice: { media_id: data.mediaId } };
    } else if (data.type === 'video') {
      payloadContent = { video: { media_id: data.mediaId } };
    }

    // 调用微信发送客服消息
    await this.mpClient.sendKefuMessage(account.appId, data.openid, data.type, payloadContent);

    // 本地留存发送记录
    return this.prisma.mpMessage.create({
      data: {
        accountId: account.id,
        appId: account.appId,
        openid: data.openid,
        type: data.type,
        sendFrom: 2, // 2: 系统回复粉丝
        content: data.content,
        mediaId: data.mediaId || null,
        createdAt: new Date(),
      },
    });
  }
}
