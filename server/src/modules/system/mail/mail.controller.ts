import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { MailAccountQueryDto } from '../dto/mail-account-query.dto';
import { MailTemplateQueryDto } from '../dto/mail-template-query.dto';
import { MailLogQueryDto } from '../dto/mail-log-query.dto';
import {
  CreateMailAccountDto,
  UpdateMailAccountDto,
  CreateMailTemplateDto,
  UpdateMailTemplateDto,
  SendMockMailDto,
} from '../dto/mail-input.dto';
import {
  MailAccountResponseDto,
  MailAccountListResponseDto,
  MailTemplateResponseDto,
  MailTemplateListResponseDto,
  MailLogListResponseDto,
} from '../dto/mail-response.dto';
import { SuccessResponseDto } from '../../../shared/dto/success-response.dto';

// ================= Mail Accounts Controller =================

@ApiTags('系统 - 邮件账号')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/mail/account')
export class MailAccountController {
  constructor(private readonly service: MailService) {}

  @Post()
  @RequirePermissions('system:mail:create')
  @Log({
    module: 'system_mail_account',
    type: 'CREATE',
    description: '创建邮件账号',
  })
  @ApiOperation({ summary: '创建邮件账号' })
  @ApiOkResponse({ type: MailAccountResponseDto })
  async create(@Body() data: CreateMailAccountDto) {
    return this.service.createAccount(data);
  }

  @Get()
  @RequirePermissions('system:mail:query')
  @ApiOperation({ summary: '分页查询邮件账号列表' })
  @ApiOkResponse({ type: MailAccountListResponseDto })
  async findAll(@Query() query: MailAccountQueryDto) {
    return this.service.findAllAccounts(query);
  }

  @Get(':id')
  @RequirePermissions('system:mail:query')
  @ApiOperation({ summary: '根据 ID 获取邮件账号详情' })
  @ApiOkResponse({ type: MailAccountResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneAccount(id);
  }

  @Put(':id')
  @RequirePermissions('system:mail:update')
  @Log({
    module: 'system_mail_account',
    type: 'UPDATE',
    description: '修改邮件账号',
  })
  @ApiOperation({ summary: '修改邮件账号' })
  @ApiOkResponse({ type: MailAccountResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMailAccountDto) {
    return this.service.updateAccount(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:mail:delete')
  @Log({
    module: 'system_mail_account',
    type: 'DELETE',
    description: '删除邮件账号',
  })
  @ApiOperation({ summary: '删除邮件账号' })
  @ApiOkResponse({ type: MailAccountResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAccount(id);
  }
}

// ================= Mail Templates Controller =================

@ApiTags('系统 - 邮件模板')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/mail/template')
export class MailTemplateController {
  constructor(private readonly service: MailService) {}

  @Post()
  @RequirePermissions('system:mail:create')
  @Log({
    module: 'system_mail_template',
    type: 'CREATE',
    description: '创建邮件模板',
  })
  @ApiOperation({ summary: '创建邮件模板' })
  @ApiOkResponse({ type: MailTemplateResponseDto })
  async create(@Body() data: CreateMailTemplateDto) {
    return this.service.createTemplate(data);
  }

  @Get()
  @RequirePermissions('system:mail:query')
  @ApiOperation({ summary: '分页查询邮件模板列表' })
  @ApiOkResponse({ type: MailTemplateListResponseDto })
  async findAll(@Query() query: MailTemplateQueryDto) {
    return this.service.findAllTemplates(query);
  }

  @Get(':id')
  @RequirePermissions('system:mail:query')
  @ApiOperation({ summary: '根据 ID 获取邮件模板详情' })
  @ApiOkResponse({ type: MailTemplateResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneTemplate(id);
  }

  @Put(':id')
  @RequirePermissions('system:mail:update')
  @Log({
    module: 'system_mail_template',
    type: 'UPDATE',
    description: '修改邮件模板',
  })
  @ApiOperation({ summary: '修改邮件模板' })
  @ApiOkResponse({ type: MailTemplateResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMailTemplateDto) {
    return this.service.updateTemplate(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:mail:delete')
  @Log({
    module: 'system_mail_template',
    type: 'DELETE',
    description: '删除邮件模板',
  })
  @ApiOperation({ summary: '删除邮件模板' })
  @ApiOkResponse({ type: MailTemplateResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeTemplate(id);
  }

  @Post(':id/send-mock')
  @RequirePermissions('system:mail:create')
  @Log({
    module: 'system_mail_template',
    type: 'CREATE',
    description: '发送测试邮件',
  })
  @ApiOperation({ summary: '发送测试/模拟邮件' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async sendMock(@Param('id', ParseIntPipe) id: number, @Body() body: SendMockMailDto) {
    const template = await this.service.findOneTemplate(id);
    return this.service.sendMail(
      template.code,
      body.receiver,
      body.params || {},
    );
  }
}

// ================= Mail Logs Controller =================

@ApiTags('系统 - 邮件日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/mail/log')
export class MailLogController {
  constructor(private readonly service: MailService) {}

  @Get()
  @RequirePermissions('system:mail:query')
  @ApiOperation({ summary: '分页查询邮件发送日志列表' })
  @ApiOkResponse({ type: MailLogListResponseDto })
  async findAll(@Query() query: MailLogQueryDto) {
    return this.service.findAllLogs(query);
  }
}

