import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';

@Injectable()
export class MpAccountService {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  async create(data: any) {
    return this.prisma.mpAccount.create({ data });
  }

  async findAll() {
    return this.prisma.mpAccount.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpAccount.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('公众号账号不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mpAccount.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mpAccount.delete({ where: { id } });
  }

  /**
   * 生成带参二维码并更新至数据库
   */
  async generateAccountQrCode(id: number): Promise<string> {
    const account = await this.findOne(id);
    const qr = await this.mpClient.createQrCode(account.appId, `account_${id}`);
    await this.prisma.mpAccount.update({
      where: { id },
      data: { qrCodeUrl: qr.url },
    });
    return qr.url;
  }

  /**
   * 清空公众号接口配额额度
   */
  async clearAccountQuota(id: number): Promise<void> {
    const account = await this.findOne(id);
    await this.mpClient.clearQuota(account.appId);
  }
}
