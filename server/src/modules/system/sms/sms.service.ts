import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class SmsService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= SMS Channels =================

  async createChannel(data: any) {
    return this.prisma.smsChannel.create({
      data: {
        code: data.code,
        name: data.name,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        signature: data.signature,
        status: data.status || 'ENABLE',
        remark: data.remark || null,
      },
    });
  }

  async findAllChannels(query?: any) {
    const where: any = {};
    if (query?.code) {
      where.code = { contains: query.code };
    }
    if (query?.name) {
      where.name = { contains: query.name };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.smsChannel.findMany({
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOneChannel(id: number) {
    const record = await this.prisma.smsChannel.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('短信渠道不存在');
    return record;
  }

  async updateChannel(id: number, data: any) {
    await this.findOneChannel(id);
    return this.prisma.smsChannel.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        signature: data.signature,
        status: data.status,
        remark: data.remark,
      },
    });
  }

  async removeChannel(id: number) {
    await this.findOneChannel(id);
    const templates = await this.prisma.smsTemplate.findFirst({
      where: { channelId: id },
    });
    if (templates) {
      throw new Error('该渠道下还有绑定的短信模板，无法删除');
    }
    return this.prisma.smsChannel.delete({ where: { id } });
  }

  // ================= SMS Templates =================

  async createTemplate(data: any) {
    // Check channel exists
    await this.findOneChannel(Number(data.channelId));
    return this.prisma.smsTemplate.create({
      data: {
        channelId: Number(data.channelId),
        code: data.code,
        name: data.name,
        content: data.content,
        status: data.status || 'ENABLE',
        remark: data.remark || null,
      },
    });
  }

  async findAllTemplates(query?: any) {
    const where: any = {};
    if (query?.code) {
      where.code = { contains: query.code };
    }
    if (query?.name) {
      where.name = { contains: query.name };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.smsTemplate.findMany({
      where,
      orderBy: { id: 'desc' },
      include: { channel: true },
    });
  }

  async findOneTemplate(id: number) {
    const record = await this.prisma.smsTemplate.findUnique({
      where: { id },
      include: { channel: true },
    });
    if (!record) throw new NotFoundException('短信模板不存在');
    return record;
  }

  async updateTemplate(id: number, data: any) {
    await this.findOneTemplate(id);
    if (data.channelId !== undefined) {
      await this.findOneChannel(Number(data.channelId));
    }
    return this.prisma.smsTemplate.update({
      where: { id },
      data: {
        channelId:
          data.channelId !== undefined ? Number(data.channelId) : undefined,
        code: data.code,
        name: data.name,
        content: data.content,
        status: data.status,
        remark: data.remark,
      },
    });
  }

  async removeTemplate(id: number) {
    await this.findOneTemplate(id);
    return this.prisma.smsTemplate.delete({ where: { id } });
  }

  // ================= SMS Logs =================

  async findAllLogs(query?: any) {
    const where: any = {};
    if (query?.mobile) {
      where.mobile = { contains: query.mobile };
    }
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.templateId) {
      where.templateId = Number(query.templateId);
    }
    return this.prisma.smsLog.findMany({
      where,
      orderBy: { sendTime: 'desc' },
      include: {
        template: {
          include: { channel: true },
        },
      },
    });
  }

  // ================= SMS Sending Simulation =================

  async sendSms(
    templateCode: string,
    mobile: string,
    params: Record<string, any>,
  ) {
    const template = await this.prisma.smsTemplate.findUnique({
      where: { code: templateCode },
      include: { channel: true },
    });

    if (!template) {
      throw new Error(`短信模板 code ${templateCode} 不存在`);
    }

    if (template.status === 'DISABLE') {
      throw new Error(`短信模板 code ${templateCode} 已禁用`);
    }

    if (template.channel.status === 'DISABLE') {
      throw new Error(`短信渠道 ${template.channel.name} 已禁用`);
    }

    // Replace placeholders e.g. "您的验证码是 {code}" -> "您的验证码是 1234"
    let content = template.content;
    Object.keys(params).forEach((key) => {
      content = content.replace(
        new RegExp(`{${key}}`, 'g'),
        String(params[key]),
      );
    });

    console.log(
      `[SMS Simulation] Sending SMS to ${mobile} via channel ${template.channel.name}. Content: "${content}"`,
    );

    // Create log
    return this.prisma.smsLog.create({
      data: {
        templateId: template.id,
        mobile,
        content,
        status: 'SUCCESS',
        errorMessage: null,
      },
    });
  }
}
