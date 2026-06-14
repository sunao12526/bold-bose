import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

// ================= Mail Accounts Controller =================

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/mail/account')
export class MailAccountController {
  constructor(private readonly service: MailService) {}

  @Post()
  @RequirePermissions('system:mail:create')
  @Log({ module: 'system_mail_account', type: 'CREATE', description: '创建邮件账号' })
  async create(@Body() data: any) {
    return this.service.createAccount(data);
  }

  @Get()
  @RequirePermissions('system:mail:query')
  async findAll(@Query() query: any) {
    return this.service.findAllAccounts(query);
  }

  @Get(':id')
  @RequirePermissions('system:mail:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneAccount(id);
  }

  @Put(':id')
  @RequirePermissions('system:mail:update')
  @Log({ module: 'system_mail_account', type: 'UPDATE', description: '修改邮件账号' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.updateAccount(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:mail:delete')
  @Log({ module: 'system_mail_account', type: 'DELETE', description: '删除邮件账号' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAccount(id);
  }
}

// ================= Mail Templates Controller =================

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/mail/template')
export class MailTemplateController {
  constructor(private readonly service: MailService) {}

  @Post()
  @RequirePermissions('system:mail:create')
  @Log({ module: 'system_mail_template', type: 'CREATE', description: '创建邮件模板' })
  async create(@Body() data: any) {
    return this.service.createTemplate(data);
  }

  @Get()
  @RequirePermissions('system:mail:query')
  async findAll(@Query() query: any) {
    return this.service.findAllTemplates(query);
  }

  @Get(':id')
  @RequirePermissions('system:mail:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneTemplate(id);
  }

  @Put(':id')
  @RequirePermissions('system:mail:update')
  @Log({ module: 'system_mail_template', type: 'UPDATE', description: '修改邮件模板' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.updateTemplate(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:mail:delete')
  @Log({ module: 'system_mail_template', type: 'DELETE', description: '删除邮件模板' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeTemplate(id);
  }

  @Post(':id/send-mock')
  @RequirePermissions('system:mail:create')
  @Log({ module: 'system_mail_template', type: 'CREATE', description: '发送测试邮件' })
  async sendMock(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const template = await this.service.findOneTemplate(id);
    return this.service.sendMail(template.code, body.receiver, body.params || {});
  }
}

// ================= Mail Logs Controller =================

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/mail/log')
export class MailLogController {
  constructor(private readonly service: MailService) {}

  @Get()
  @RequirePermissions('system:mail:query')
  async findAll(@Query() query: any) {
    return this.service.findAllLogs(query);
  }
}
