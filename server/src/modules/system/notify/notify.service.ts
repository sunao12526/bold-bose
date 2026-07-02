import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ConfigService } from '../config/config.service';
import { MailService } from '../mail/mail.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private mailService: MailService,
    private smsService: SmsService,
  ) {}

  // ==================== Templates CRUD ====================

  async createTemplate(data: any) {
    const existing = await this.prisma.notifyTemplate.findUnique({
      where: { code: data.code },
    });
    if (existing) throw new BadRequestException('模板编码已存在');
    return this.prisma.notifyTemplate.create({ data });
  }

  async findAllTemplates() {
    return this.prisma.notifyTemplate.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOneTemplate(id: number) {
    const template = await this.prisma.notifyTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new NotFoundException('通知模板不存在');
    return template;
  }

  async updateTemplate(id: number, data: any) {
    await this.findOneTemplate(id);
    if (data.code) {
      const existing = await this.prisma.notifyTemplate.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (existing) throw new BadRequestException('模板编码已存在');
    }
    return this.prisma.notifyTemplate.update({
      where: { id },
      data,
    });
  }

  async removeTemplate(id: number) {
    await this.findOneTemplate(id);
    return this.prisma.notifyTemplate.delete({
      where: { id },
    });
  }

  // ==================== Dispatch / Send Operations ====================

  /**
   * Renders the variables in the string, e.g. "Welcome {nickname}" -> "Welcome John"
   */
  private render(
    templateStr: string,
    variables: Record<string, string>,
  ): string {
    if (!templateStr) return '';
    return templateStr.replace(/\{([^{}]+)\}/g, (match, key) => {
      const cleanedKey = key.trim();
      return variables[cleanedKey] !== undefined
        ? variables[cleanedKey]
        : match;
    });
  }

  /**
   * Dispatches a notification to a specific user using a template code
   */
  async send(
    userId: number,
    templateCode: string,
    variables: Record<string, string> = {},
  ) {
    // 1. Get Template
    const template = await this.prisma.notifyTemplate.findUnique({
      where: { code: templateCode },
    });
    if (!template) {
      throw new NotFoundException(`通知模板 [${templateCode}] 不存在`);
    }
    if (template.status === 'DISABLE') {
      throw new BadRequestException(`通知模板 [${templateCode}] 已被禁用`);
    }

    // 2. Get User Info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`目标用户 [ID: ${userId}] 不存在`);
    }

    // Include standard user variables automatically if not provided
    const mergedVariables = {
      username: user.username,
      nickname: user.nickname,
      email: user.email || '',
      mobile: user.mobile || '',
      ...variables,
    };

    // 3. Render content
    const renderedTitle = this.render(template.title, mergedVariables);
    const renderedContent = this.render(template.content, mergedVariables);

    let status = 200;
    let errorMessage: string | null = null;

    if (template.type === 'SYSTEM') {
      // System Notification (站内信)
      try {
        await this.prisma.notifyMessage.create({
          data: {
            templateId: template.id,
            templateCode: template.code,
            userId: user.id,
            username: user.username,
            title: renderedTitle,
            content: renderedContent,
            status: 200,
          },
        });
      } catch (err: any) {
        status = 500;
        errorMessage = err.message || '写入站内信失败';
      }
    } else if (template.type === 'EMAIL') {
      // Email Notification
      if (!user.email) {
        status = 500;
        errorMessage = `用户 [${user.username}] 未绑定邮箱地址`;
      } else {
        try {
          // 确保 MailTemplate 存在（如果不存在则基于 NotifyTemplate 动态新建并关联默认邮件账号）
          await this.mailService.ensureTemplateExists(template.code, {
            name: template.name,
            title: template.title,
            content: template.content,
          });
          // 使用统一的邮件服务进行发信和 MailLog 日志记录
          await this.mailService.sendMail(template.code, user.email, variables);
        } catch (err: any) {
          status = 500;
          errorMessage = err.message || '发送邮件失败';
        }
      }

      // Log the message status in system_notify_messages
      await this.prisma.notifyMessage.create({
        data: {
          templateId: template.id,
          templateCode: template.code,
          userId: user.id,
          username: user.username,
          title: renderedTitle,
          content: renderedContent,
          status,
          errorMessage,
        },
      });
    } else if (template.type === 'SMS') {
      // SMS Notification
      if (!user.mobile) {
        status = 500;
        errorMessage = `用户 [${user.username}] 未绑定手机号`;
      } else {
        try {
          // 确保 SmsTemplate 存在（如果不存在则基于 NotifyTemplate 动态新建并关联默认短信渠道）
          await this.smsService.ensureTemplateExists(template.code, {
            name: template.name,
            content: template.content,
          });
          // 使用统一的短信服务进行发送和 SmsLog 日志记录
          await this.smsService.sendSms(template.code, user.mobile, variables);
        } catch (err: any) {
          status = 500;
          errorMessage = err.message || '发送短信失败';
        }
      }

      await this.prisma.notifyMessage.create({
        data: {
          templateId: template.id,
          templateCode: template.code,
          userId: user.id,
          username: user.username,
          title: renderedTitle,
          content: renderedContent,
          status,
          errorMessage,
        },
      });
    } else {
      throw new BadRequestException(`未知的通知类型 [${template.type}]`);
    }

    if (status !== 200) {
      throw new Error(errorMessage || '通知发送失败');
    }

    return { success: true };
  }

  // ==================== User Inbox Operations ====================

  async getMyInbox(userId: number) {
    return this.prisma.notifyMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(userId: number, messageId: number) {
    const msg = await this.prisma.notifyMessage.findFirst({
      where: { id: messageId, userId },
    });
    if (!msg) throw new NotFoundException('消息不存在或不属于当前用户');
    return this.prisma.notifyMessage.update({
      where: { id: messageId },
      data: {
        read: true,
        readTime: new Date(),
      },
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notifyMessage.updateMany({
      where: { userId, read: false },
      data: {
        read: true,
        readTime: new Date(),
      },
    });
  }
}
