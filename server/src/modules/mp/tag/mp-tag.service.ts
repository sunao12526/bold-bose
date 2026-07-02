import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';

@Injectable()
export class MpTagService {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  /**
   * 创建微信公众号标签 (自动通过微信 API 申请 tagId 并保存)
   */
  async create(data: { accountId: number; name: string }) {
    const account = await this.prisma.mpAccount.findUnique({
      where: { id: Number(data.accountId) },
    });
    if (!account) throw new NotFoundException('公众号账号不存在');

    // 调用微信接口创建标签，获取微信官方分配的 tagId
    const wxTag = await this.mpClient.createTag(account.appId, data.name);

    return this.prisma.mpTag.create({
      data: {
        accountId: account.id,
        appId: account.appId,
        tagId: wxTag.id,
        name: wxTag.name,
        count: 0,
      },
    });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    return this.prisma.mpTag.findMany({ where, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpTag.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('标签不存在');
    return record;
  }

  /**
   * 修改微信公众号标签 (同步至微信官方服务器)
   */
  async update(id: number, data: { name: string }) {
    const record = await this.findOne(id);
    
    // 同步到微信官方
    await this.mpClient.updateTag(record.appId, record.tagId, data.name);

    return this.prisma.mpTag.update({
      where: { id },
      data: { name: data.name },
    });
  }

  /**
   * 删除微信公众号标签 (同步至微信官方服务器)
   */
  async remove(id: number) {
    const record = await this.findOne(id);
    
    // 同步到微信官方
    await this.mpClient.deleteTag(record.appId, record.tagId);

    return this.prisma.mpTag.delete({ where: { id } });
  }

  /**
   * 同步微信官方标签列表到本地数据库
   */
  async syncTag(accountId: number): Promise<void> {
    const account = await this.prisma.mpAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('公众号账号不存在');

    // 1. 获取微信端的最新标签列表
    const wxTags = await this.mpClient.getTags(account.appId);

    // 2. 本地执行同步事务
    await this.prisma.$transaction(async (tx) => {
      // 删除本地该账号所有的标签记录
      await tx.mpTag.deleteMany({
        where: { accountId },
      });

      // 批量写入拉取的标签记录
      if (wxTags && wxTags.length > 0) {
        await tx.mpTag.createMany({
          data: wxTags.map(tag => ({
            accountId: account.id,
            appId: account.appId,
            tagId: tag.id,
            name: tag.name,
            count: tag.count,
          })),
        });
      }
    });
  }
}
