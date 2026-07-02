import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';

@Injectable()
export class MpUserService {
  private readonly logger = new Logger(MpUserService.name);

  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    if (query?.keyword) {
      where.OR = [
        { nickname: { contains: query.keyword, mode: 'insensitive' } },
        { openid: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }
    if (query?.subscribeStatus !== undefined) where.subscribeStatus = Number(query.subscribeStatus);
    return this.prisma.mpUser.findMany({ where, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpUser.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('粉丝不存在');
    return record;
  }

  /**
   * 同步更新粉丝信息（备注、打标签）
   */
  async updateUser(id: number, data: { remark?: string; tagIds?: number[] }) {
    const user = await this.findOne(id);

    // 1. 如果修改了备注，同步调用微信接口
    if (data.remark !== undefined && data.remark !== user.remark) {
      await this.mpClient.updateRemark(user.appId, user.openid, data.remark);
    }

    // 2. 如果修改了标签，计算标签增减并同步微信
    if (data.tagIds !== undefined) {
      const oldTags: number[] = user.tagIds ? JSON.parse(user.tagIds as string) : [];
      const newTags: number[] = data.tagIds;

      // 找出新增的标签和被删除的标签
      const addedTags = newTags.filter(t => !oldTags.includes(t));
      const removedTags = oldTags.filter(t => !newTags.includes(t));

      for (const tagId of addedTags) {
        await this.mpClient.batchTagging(user.appId, [user.openid], tagId);
      }

      for (const tagId of removedTags) {
        await this.mpClient.batchUntagging(user.appId, [user.openid], tagId);
      }
    }

    // 3. 更新本地库
    return this.prisma.mpUser.update({
      where: { id },
      data: {
        remark: data.remark !== undefined ? data.remark : undefined,
        tagIds: data.tagIds !== undefined ? JSON.stringify(data.tagIds) : undefined,
      },
    });
  }

  /**
   * 异步或同步拉取微信服务器上所有的粉丝，并写入/更新本地库
   */
  async syncUser(accountId: number): Promise<void> {
    const account = await this.prisma.mpAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('微信公众号账号不存在');

    // 开启异步后台同步任务，防止接口超时
    this.executeBackgroundSync(account.id, account.appId).catch(err => {
      this.logger.error(`后台粉丝同步任务失败: ${err.message}`, err.stack);
    });
  }

  private async executeBackgroundSync(accountId: number, appId: string) {
    this.logger.log(`开始同步公众号 [${appId}] 的粉丝列表...`);
    let nextOpenid = '';
    let totalSynced = 0;

    do {
      const followersResult = await this.mpClient.getFollowers(appId, nextOpenid);
      const openids = followersResult.openids;
      nextOpenid = followersResult.nextOpenid;

      if (!openids || openids.length === 0) {
        break;
      }

      // 分批获取用户详情 (每批最多 100 个)
      const chunkSize = 100;
      for (let i = 0; i < openids.length; i += chunkSize) {
        const chunkOpenids = openids.slice(i, i + chunkSize);
        const userInfos = await this.mpClient.getUserInfoBatch(appId, chunkOpenids);

        // 批量 upsert 进本地数据库
        for (const info of userInfos) {
          const userData = {
            accountId,
            appId,
            openid: info.openid,
            unionid: info.unionid || null,
            subscribeStatus: info.subscribe || 0,
            subscribeTime: info.subscribe_time ? new Date(info.subscribe_time * 1000) : null,
            nickname: info.nickname || '',
            headImageUrl: info.headimgurl || '',
            language: info.language || 'zh_CN',
            country: info.country || '',
            province: info.province || '',
            city: info.city || '',
            remark: info.remark || '',
            sex: info.sex || 0,
            tagIds: info.tagid_list ? JSON.stringify(info.tagid_list) : '[]',
          };

          await this.prisma.mpUser.upsert({
            where: { accountId_openid: { accountId, openid: info.openid } },
            create: userData,
            update: userData,
          });
        }
        totalSynced += userInfos.length;
      }

      // 如果 nextOpenid 为空，说明已拉取完毕
      if (!nextOpenid) break;
    } while (true);

    this.logger.log(`公众号 [${appId}] 粉丝同步成功，总计同步粉丝数: ${totalSynced}`);
  }
}
