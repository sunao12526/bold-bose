import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= Mail Accounts =================

  async createAccount(data: any) {
    return this.prisma.mailAccount.create({
      data: {
        mail: data.mail,
        username: data.username,
        password: data.password,
        host: data.host,
        port: Number(data.port),
        ssl: data.ssl === true || data.ssl === 'true',
        status: data.status || 'ENABLE',
      },
    });
  }

  async findAllAccounts(query?: any) {
    const where: any = {};
    if (query?.mail) {
      where.mail = { contains: query.mail };
    }
    if (query?.username) {
      where.username = { contains: query.username };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.mailAccount.findMany({
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOneAccount(id: number) {
    const record = await this.prisma.mailAccount.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('邮件账号不存在');
    return record;
  }

  async updateAccount(id: number, data: any) {
    await this.findOneAccount(id);
    return this.prisma.mailAccount.update({
      where: { id },
      data: {
        mail: data.mail,
        username: data.username,
        password: data.password,
        host: data.host,
        port: data.port !== undefined ? Number(data.port) : undefined,
        ssl:
          data.ssl !== undefined
            ? data.ssl === true || data.ssl === 'true'
            : undefined,
        status: data.status,
      },
    });
  }

  async removeAccount(id: number) {
    await this.findOneAccount(id);
    const templates = await this.prisma.mailTemplate.findFirst({
      where: { accountId: id },
    });
    if (templates) {
      throw new Error('该账号下还有绑定的邮件模板，无法删除');
    }
    return this.prisma.mailAccount.delete({ where: { id } });
  }

  // ================= Mail Templates =================

  async createTemplate(data: any) {
    await this.findOneAccount(Number(data.accountId));
    return this.prisma.mailTemplate.create({
      data: {
        accountId: Number(data.accountId),
        code: data.code,
        name: data.name,
        title: data.title,
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
    return this.prisma.mailTemplate.findMany({
      where,
      orderBy: { id: 'desc' },
      include: { account: true },
    });
  }

  async findOneTemplate(id: number) {
    const record = await this.prisma.mailTemplate.findUnique({
      where: { id },
      include: { account: true },
    });
    if (!record) throw new NotFoundException('邮件模板不存在');
    return record;
  }

  async updateTemplate(id: number, data: any) {
    await this.findOneTemplate(id);
    if (data.accountId !== undefined) {
      await this.findOneAccount(Number(data.accountId));
    }
    return this.prisma.mailTemplate.update({
      where: { id },
      data: {
        accountId:
          data.accountId !== undefined ? Number(data.accountId) : undefined,
        code: data.code,
        name: data.name,
        title: data.title,
        content: data.content,
        status: data.status,
        remark: data.remark,
      },
    });
  }

  async removeTemplate(id: number) {
    await this.findOneTemplate(id);
    return this.prisma.mailTemplate.delete({ where: { id } });
  }

  // ================= Mail Logs =================

  async findAllLogs(query?: any) {
    const where: any = {};
    if (query?.receiver) {
      where.receiver = { contains: query.receiver };
    }
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.templateId) {
      where.templateId = Number(query.templateId);
    }
    return this.prisma.mailLog.findMany({
      where,
      orderBy: { sendTime: 'desc' },
      include: {
        template: {
          include: { account: true },
        },
      },
    });
  }

  // ================= Mail Sending Simulation =================

  async sendMail(
    templateCode: string,
    receiver: string,
    params: Record<string, any>,
  ) {
    const template = await this.prisma.mailTemplate.findUnique({
      where: { code: templateCode },
      include: { account: true },
    });

    if (!template) {
      throw new Error(`邮件模板 code ${templateCode} 不存在`);
    }

    if (template.status === 'DISABLE') {
      throw new Error(`邮件模板 code ${templateCode} 已禁用`);
    }

    if (template.account.status === 'DISABLE') {
      throw new Error(`邮件账号 ${template.account.mail} 已禁用`);
    }

    // Replace placeholders in Title and Content
    let title = template.title;
    let content = template.content;
    Object.keys(params).forEach((key) => {
      const regex = new RegExp(`{${key}}`, 'g');
      title = title.replace(regex, String(params[key]));
      content = content.replace(regex, String(params[key]));
    });

    let status = 'SUCCESS';
    let errorMessage: string | null = null;

    try {
      // Create Nodemailer Transporter dynamically
      const transporter = nodemailer.createTransport({
        host: template.account.host,
        port: template.account.port,
        secure: template.account.ssl,
        auth: {
          user: template.account.username,
          pass: template.account.password,
        },
      });

      await transporter.sendMail({
        from: template.account.mail,
        to: receiver,
        subject: title,
        html: content,
      });

      console.log(
        `[Mail Service] Email sent successfully to ${receiver} using template ${templateCode}`,
      );
    } catch (err: any) {
      console.error(`[Mail Service] Failed to send email to ${receiver}:`, err);
      status = 'FAIL';
      errorMessage = err.message || String(err);
    }

    // Create log
    return this.prisma.mailLog.create({
      data: {
        templateId: template.id,
        receiver,
        title,
        content,
        status,
        errorMessage,
      },
    });
  }
}
