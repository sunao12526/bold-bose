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
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { SmsChannelQueryDto } from '../dto/sms-channel-query.dto';
import { SmsTemplateQueryDto } from '../dto/sms-template-query.dto';
import { SmsLogQueryDto } from '../dto/sms-log-query.dto';
import {
  CreateSmsChannelDto,
  UpdateSmsChannelDto,
  CreateSmsTemplateDto,
  UpdateSmsTemplateDto,
  SendMockSmsDto,
} from '../dto/sms-input.dto';
import {
  SmsChannelResponseDto,
  SmsChannelListResponseDto,
  SmsTemplateResponseDto,
  SmsTemplateListResponseDto,
  SmsLogListResponseDto,
} from '../dto/sms-response.dto';
import { SuccessResponseDto } from '../../auth/dto/auth-response.dto';

// ================= SMS Channels Controller =================

@ApiTags('系统 - 短信渠道')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/sms/channel')
export class SmsChannelController {
  constructor(private readonly service: SmsService) {}

  @Post()
  @RequirePermissions('system:sms:create')
  @Log({
    module: 'system_sms_channel',
    type: 'CREATE',
    description: '创建短信渠道',
  })
  @ApiOperation({ summary: '创建短信渠道' })
  @ApiOkResponse({ type: SmsChannelResponseDto })
  async create(@Body() data: CreateSmsChannelDto) {
    return this.service.createChannel(data);
  }

  @Get()
  @RequirePermissions('system:sms:query')
  @ApiOperation({ summary: '分页查询短信渠道列表' })
  @ApiOkResponse({ type: SmsChannelListResponseDto })
  async findAll(@Query() query: SmsChannelQueryDto) {
    return this.service.findAllChannels(query);
  }

  @Get(':id')
  @RequirePermissions('system:sms:query')
  @ApiOperation({ summary: '根据 ID 获取短信渠道详情' })
  @ApiOkResponse({ type: SmsChannelResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneChannel(id);
  }

  @Put(':id')
  @RequirePermissions('system:sms:update')
  @Log({
    module: 'system_sms_channel',
    type: 'UPDATE',
    description: '修改短信渠道',
  })
  @ApiOperation({ summary: '修改短信渠道' })
  @ApiOkResponse({ type: SmsChannelResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSmsChannelDto) {
    return this.service.updateChannel(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:sms:delete')
  @Log({
    module: 'system_sms_channel',
    type: 'DELETE',
    description: '删除短信渠道',
  })
  @ApiOperation({ summary: '删除短信渠道' })
  @ApiOkResponse({ type: SmsChannelResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeChannel(id);
  }
}

// ================= SMS Templates Controller =================

@ApiTags('系统 - 短信模板')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/sms/template')
export class SmsTemplateController {
  constructor(private readonly service: SmsService) {}

  @Post()
  @RequirePermissions('system:sms:create')
  @Log({
    module: 'system_sms_template',
    type: 'CREATE',
    description: '创建短信模板',
  })
  @ApiOperation({ summary: '创建短信模板' })
  @ApiOkResponse({ type: SmsTemplateResponseDto })
  async create(@Body() data: CreateSmsTemplateDto) {
    return this.service.createTemplate(data);
  }

  @Get()
  @RequirePermissions('system:sms:query')
  @ApiOperation({ summary: '分页查询短信模板列表' })
  @ApiOkResponse({ type: SmsTemplateListResponseDto })
  async findAll(@Query() query: SmsTemplateQueryDto) {
    return this.service.findAllTemplates(query);
  }

  @Get(':id')
  @RequirePermissions('system:sms:query')
  @ApiOperation({ summary: '根据 ID 获取短信模板详情' })
  @ApiOkResponse({ type: SmsTemplateResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneTemplate(id);
  }

  @Put(':id')
  @RequirePermissions('system:sms:update')
  @Log({
    module: 'system_sms_template',
    type: 'UPDATE',
    description: '修改短信模板',
  })
  @ApiOperation({ summary: '修改短信模板' })
  @ApiOkResponse({ type: SmsTemplateResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSmsTemplateDto) {
    return this.service.updateTemplate(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:sms:delete')
  @Log({
    module: 'system_sms_template',
    type: 'DELETE',
    description: '删除短信模板',
  })
  @ApiOperation({ summary: '删除短信模板' })
  @ApiOkResponse({ type: SmsTemplateResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeTemplate(id);
  }

  @Post(':id/send-mock')
  @RequirePermissions('system:sms:create')
  @Log({
    module: 'system_sms_template',
    type: 'CREATE',
    description: '发送测试短信',
  })
  @ApiOperation({ summary: '发送测试/模拟短信' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async sendMock(@Param('id', ParseIntPipe) id: number, @Body() body: SendMockSmsDto) {
    const template = await this.service.findOneTemplate(id);
    return this.service.sendSms(template.code, body.mobile, body.params || {});
  }
}

// ================= SMS Logs Controller =================

@ApiTags('系统 - 短信日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/sms/log')
export class SmsLogController {
  constructor(private readonly service: SmsService) {}

  @Get()
  @RequirePermissions('system:sms:query')
  @ApiOperation({ summary: '分页查询短信发送日志列表' })
  @ApiOkResponse({ type: SmsLogListResponseDto })
  async findAll(@Query() query: SmsLogQueryDto) {
    return this.service.findAllLogs(query);
  }
}

