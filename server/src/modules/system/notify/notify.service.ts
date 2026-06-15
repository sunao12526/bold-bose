import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ConfigService } from '../config/config.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotifyService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
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
          await this.sendEmail(user.email, renderedTitle, renderedContent);
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
      // SMS Notification (Simulated)
      console.log(
        `[SMS SEND SIMULATION] To: ${user.mobile || 'Unknown'}, Body: ${renderedContent}`,
      );
      if (!user.mobile) {
        status = 500;
        errorMessage = `用户 [${user.username}] 未绑定手机号`;
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

  /**
   * Helper to dynamic load SMTP config and send an email
   */
  private async sendEmail(to: string, subject: string, htmlContent: string) {
    let host = 'smtp.mailtrap.io';
    let port = 2525;
    let username = '';
    let password = '';
    let secure = false;
    let from = 'system@yudao.local';

    // Attempt to load from dynamic configs
    try {
      const configHost = await this.configService.findByKey('sys.mail.host');
      host = configHost.value;
      const configPort = await this.configService.findByKey('sys.mail.port');
      port = parseInt(configPort.value, 10) || port;
      const configUsername =
        await this.configService.findByKey('sys.mail.username');
      username = configUsername.value;
      const configPassword =
        await this.configService.findByKey('sys.mail.password');
      password = configPassword.value;
      const configSsl = await this.configService.findByKey('sys.mail.ssl');
      secure = configSsl.value === 'true' || configSsl.value === '1';
      const configFrom = await this.configService.findByKey('sys.mail.from');
      from = configFrom.value;
    } catch (err) {
      console.warn(
        'Unable to load SMTP configurations from SysConfig, falling back to process env defaults.',
      );
      host = process.env.SMTP_HOST || host;
      port = parseInt(process.env.SMTP_PORT || '', 10) || port;
      username = process.env.SMTP_USERNAME || username;
      password = process.env.SMTP_PASSWORD || password;
      secure = process.env.SMTP_SSL === 'true' || secure;
      from = process.env.SMTP_FROM || from;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth:
        username && password ? { user: username, pass: password } : undefined,
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent,
    });
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
