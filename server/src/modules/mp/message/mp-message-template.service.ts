import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';

@Injectable()
export class MpMessageTemplateService {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    return this.prisma.mpMessageTemplate.findMany({ where, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpMessageTemplate.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('模板消息不存在');
    return record;
  }

  /**
   * 同步微信公众号模板消息配置到本地数据库
   */
  async syncTemplate(accountId: number): Promise<void> {
    const account = await this.prisma.mpAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('公众号账号不存在');

    // 1. 获取微信端的最新模板列表
    const templates = await this.mpClient.getPrivateTemplates(account.appId);

    // 2. 本地执行同步事务
    await this.prisma.$transaction(async (tx) => {
      // 级联清空本地该账号的全部模板
      await tx.mpMessageTemplate.deleteMany({ where: { accountId } });

      if (templates && templates.length > 0) {
        await tx.mpMessageTemplate.createMany({
          data: templates.map(t => ({
            accountId: account.id,
            appId: account.appId,
            templateId: t.template_id,
            title: t.title,
            content: t.content,
            example: t.example || null,
            primaryIndustry: t.primary_industry || null,
            deputyIndustry: t.deputy_industry || null,
          })),
        });
      }
    });
  }

  /**
   * 给特定用户发送模板消息
   */
  async sendTemplateMessage(
    id: number,
    openid: string,
    data: any,
    url?: string,
    miniprogram?: any
  ): Promise<number> {
    const template = await this.findOne(id);
    return this.mpClient.sendTemplateMessage(
      template.appId,
      openid,
      template.templateId,
      data,
      url,
      miniprogram
    );
  }
}
