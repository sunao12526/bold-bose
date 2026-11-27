import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { SmsClientFactory } from './client/sms-client.factory';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
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
        apiTemplateId: data.apiTemplateId || null,
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
        apiTemplateId: data.apiTemplateId,
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

  async ensureTemplateExists(
    code: string,
    defaultData: { name: string; content: string },
  ) {
    let template = await this.prisma.smsTemplate.findUnique({
      where: { code },
    });
    if (!template) {
      const defaultChannel = await this.prisma.smsChannel.findFirst({
        where: { status: 'ENABLE' },
      });
      if (!defaultChannel) {
        throw new Error(
          '未找到启用的短信渠道，请先在[系统管理 - 短信配置]中配置短信发信渠道。',
        );
      }
      template = await this.prisma.smsTemplate.create({
        data: {
          channelId: defaultChannel.id,
          code,
          name: defaultData.name,
          content: defaultData.content,
          status: 'ENABLE',
        },
      });
    }
    return template;
  }

  // ================= SMS Real/Debug Dispatch & Callback =================

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

    const client = SmsClientFactory.create({
      code: template.channel.code,
      apiKey: template.channel.apiKey,
      apiSecret: template.channel.apiSecret,
      signature: template.channel.signature,
    });

    let sendResult: { success: boolean; serialNo?: string; errorMessage?: string };
    try {
      sendResult = await client.sendSms({
        mobile,
        content,
        apiTemplateId: template.apiTemplateId,
        params,
      });
    } catch (err: any) {
      sendResult = {
        success: false,
        errorMessage: err?.message || String(err),
      };
    }

    return this.prisma.smsLog.create({
      data: {
        templateId: template.id,
        mobile,
        content,
        status: sendResult.success ? 'SUCCESS' : 'FAIL',
        apiSerialNo: sendResult.serialNo || null,
        receiveStatus: sendResult.success ? 'WAITING' : 'FAIL',
        errorMessage: sendResult.success
          ? null
          : (sendResult.errorMessage || '短信发送失败').slice(0, 500),
      },
    });
  }

  async receiveCallback(channelCode: string, payload: any) {
    const items = Array.isArray(payload) ? payload : [payload];
    const codeUpper = (channelCode || '').toUpperCase();
    let updatedCount = 0;

    for (const item of items) {
      if (!item || typeof item !== 'object') continue;

      let serialNo = '';
      let isSuccess = false;
      let receiveMsg = '';
      let receiveTime = new Date();

      if (codeUpper === 'ALIYUN') {
        serialNo = String(item.biz_id || item.bizId || '');
        isSuccess = item.success === true || item.success === 'true';
        receiveMsg = String(item.err_msg || item.err_code || '');
        if (item.report_time) {
          receiveTime = new Date(item.report_time);
        }
      } else if (codeUpper === 'TENCENT') {
        serialNo = String(item.sid || item.serial_no || '');
        isSuccess = String(item.report_status || '').toUpperCase() === 'SUCCESS';
        receiveMsg = String(item.description || item.errmsg || '');
        if (item.user_receive_time) {
          receiveTime = new Date(item.user_receive_time);
        }
      } else {
        serialNo = String(item.serialNo || item.biz_id || item.sid || '');
        isSuccess = Boolean(item.success);
        receiveMsg = String(item.message || '');
      }

      if (!serialNo) continue;

      const res = await this.prisma.smsLog.updateMany({
        where: { apiSerialNo: serialNo },
        data: {
          receiveStatus: isSuccess ? 'SUCCESS' : 'FAIL',
          receiveTime,
          receiveMsg: receiveMsg.slice(0, 500) || null,
        },
      });
      updatedCount += res.count;
    }

    return { updatedCount };
  }
}
