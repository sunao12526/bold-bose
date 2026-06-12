import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/notify-template')
export class NotifyTemplateController {
  constructor(private notifyService: NotifyService) {}

  @Post()
  @RequirePermissions('system:notify-template:create')
  @Log({ module: '通知模板', type: 'CREATE', description: '创建通知模板' })
  async create(@Body() data: any) {
    return this.notifyService.createTemplate(data);
  }

  @Get()
  @RequirePermissions('system:notify-template:query')
  async findAll() {
    return this.notifyService.findAllTemplates();
  }

  @Get(':id')
  @RequirePermissions('system:notify-template:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notifyService.findOneTemplate(id);
  }

  @Put(':id')
  @RequirePermissions('system:notify-template:update')
  @Log({ module: '通知模板', type: 'UPDATE', description: '修改通知模板' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.notifyService.updateTemplate(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:notify-template:delete')
  @Log({ module: '通知模板', type: 'DELETE', description: '删除通知模板' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.notifyService.removeTemplate(id);
  }

  @Post('send-test')
  @RequirePermissions('system:notify-template:update')
  @Log({ module: '通知模板', type: 'UPDATE', description: '测试发送通知' })
  async sendTest(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('templateCode') templateCode: string,
    @Body('variables') variables: Record<string, string>,
  ) {
    return this.notifyService.send(userId, templateCode, variables);
  }
}
