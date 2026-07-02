import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';

@Injectable()
export class MpMaterialService {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  /**
   * 上传临时素材并入库
   */
  async uploadTemporary(
    accountId: number,
    type: string,
    fileBuffer: Buffer,
    fileName: string
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号账号不存在');

    // 上传到微信服务器
    const wxMaterial = await this.mpClient.uploadTemporaryMaterial(account.appId, type, fileBuffer, fileName);

    // 写入本地数据库
    return this.prisma.mpMaterial.create({
      data: {
        accountId: account.id,
        appId: account.appId,
        mediaId: wxMaterial.media_id,
        type,
        permanent: false,
        url: wxMaterial.url || '',
        name: fileName,
      },
    });
  }

  /**
   * 上传永久素材并入库
   */
  async uploadPermanent(
    accountId: number,
    type: string,
    fileBuffer: Buffer,
    fileName: string,
    title?: string,
    introduction?: string
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号账号不存在');

    // 上传到微信服务器
    const wxMaterial = await this.mpClient.uploadPermanentMaterial(
      account.appId,
      type,
      fileBuffer,
      fileName,
      title,
      introduction
    );

    // 写入本地数据库
    return this.prisma.mpMaterial.create({
      data: {
        accountId: account.id,
        appId: account.appId,
        mediaId: wxMaterial.media_id,
        type,
        permanent: true,
        url: wxMaterial.url || '',
        name: fileName,
        title: title || null,
        introduction: introduction || null,
      },
    });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    if (query?.type) where.type = query.type;
    return this.prisma.mpMaterial.findMany({ where, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpMaterial.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('素材不存在');
    return record;
  }

  /**
   * 删除永久素材 (本地数据库 + 微信服务器同步)
   */
  async remove(id: number) {
    const record = await this.findOne(id);
    
    // 如果是永久素材，需要调用微信删除接口
    if (record.permanent && record.mediaId) {
      try {
        await this.mpClient.deletePermanentMaterial(record.appId, record.mediaId);
      } catch (e) {
        // 允许微信端已失效/不存在时的容错
      }
    }

    return this.prisma.mpMaterial.delete({ where: { id } });
  }
}
