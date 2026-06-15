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
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

// ================= SMS Channels Controller =================

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
  async create(@Body() data: any) {
    return this.service.createChannel(data);
  }

  @Get()
  @RequirePermissions('system:sms:query')
  async findAll(@Query() query: any) {
    return this.service.findAllChannels(query);
  }

  @Get(':id')
  @RequirePermissions('system:sms:query')
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.updateChannel(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:sms:delete')
  @Log({
    module: 'system_sms_channel',
    type: 'DELETE',
    description: '删除短信渠道',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeChannel(id);
  }
}

// ================= SMS Templates Controller =================

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
  async create(@Body() data: any) {
    return this.service.createTemplate(data);
  }

  @Get()
  @RequirePermissions('system:sms:query')
  async findAll(@Query() query: any) {
    return this.service.findAllTemplates(query);
  }

  @Get(':id')
  @RequirePermissions('system:sms:query')
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.updateTemplate(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:sms:delete')
  @Log({
    module: 'system_sms_template',
    type: 'DELETE',
    description: '删除短信模板',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeTemplate(id);
  }

  @Post(':id/send-mock')
  @RequirePermissions('system:sms:create') // Same perm as create/edit to trigger mock send
  @Log({
    module: 'system_sms_template',
    type: 'CREATE',
    description: '发送测试短信',
  })
  async sendMock(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const template = await this.service.findOneTemplate(id);
    return this.service.sendSms(template.code, body.mobile, body.params || {});
  }
}

// ================= SMS Logs Controller =================

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/sms/log')
export class SmsLogController {
  constructor(private readonly service: SmsService) {}

  @Get()
  @RequirePermissions('system:sms:query')
  async findAll(@Query() query: any) {
    return this.service.findAllLogs(query);
  }
}
