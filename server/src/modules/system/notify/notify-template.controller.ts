import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotifyService } from './notify.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CreateNotifyTemplateDto, UpdateNotifyTemplateDto, SendTestNotifyDto } from '../dto/notify-input.dto';
import { NotifyTemplateResponseDto } from '../dto/notify-response.dto';
import { SuccessResponseDto } from '../../../shared/dto/success-response.dto';

@ApiTags('系统 - 站内信模板')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/notify-template')
export class NotifyTemplateController {
  constructor(private notifyService: NotifyService) {}

  @Post()
  @RequirePermissions('system:notify-template:create')
  @Log({ module: '通知模板', type: 'CREATE', description: '创建通知模板' })
  @ApiOperation({ summary: '创建通知模板' })
  @ApiOkResponse({ type: NotifyTemplateResponseDto })
  async create(@Body() data: CreateNotifyTemplateDto) {
    return this.notifyService.createTemplate(data);
  }

  @Get()
  @RequirePermissions('system:notify-template:query')
  @ApiOperation({ summary: '获取所有通知模板列表' })
  @ApiOkResponse({ type: NotifyTemplateResponseDto, isArray: true })
  async findAll() {
    return this.notifyService.findAllTemplates();
  }

  @Get(':id')
  @RequirePermissions('system:notify-template:query')
  @ApiOperation({ summary: '根据 ID 获取通知模板详情' })
  @ApiOkResponse({ type: NotifyTemplateResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notifyService.findOneTemplate(id);
  }

  @Put(':id')
  @RequirePermissions('system:notify-template:update')
  @Log({ module: '通知模板', type: 'UPDATE', description: '修改通知模板' })
  @ApiOperation({ summary: '修改通知模板' })
  @ApiOkResponse({ type: NotifyTemplateResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateNotifyTemplateDto) {
    return this.notifyService.updateTemplate(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:notify-template:delete')
  @Log({ module: '通知模板', type: 'DELETE', description: '删除通知模板' })
  @ApiOperation({ summary: '删除通知模板' })
  @ApiOkResponse({ type: NotifyTemplateResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.notifyService.removeTemplate(id);
  }

  @Post('send-test')
  @RequirePermissions('system:notify-template:update')
  @Log({ module: '通知模板', type: 'UPDATE', description: '测试发送通知' })
  @ApiOperation({ summary: '测试发送系统通知' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async sendTest(
    @Body() body: SendTestNotifyDto,
  ) {
    return this.notifyService.send(body.userId, body.templateCode, body.variables || {});
  }
}

