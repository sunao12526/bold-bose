import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OAuth2Service } from './oauth2.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/oauth2-client')
export class OAuth2ClientController {
  constructor(private readonly service: OAuth2Service) {}

  @Post()
  @RequirePermissions('system:oauth2:create')
  @Log({ module: 'system_oauth2_client', type: 'CREATE', description: '创建 OAuth2 客户端' })
  async create(@Body() data: any) {
    return this.service.createClient(data);
  }

  @Get()
  @RequirePermissions('system:oauth2:query')
  async findAll(@Query() query: any) {
    return this.service.findAllClients(query);
  }

  @Get(':id')
  @RequirePermissions('system:oauth2:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneClient(id);
  }

  @Put(':id')
  @RequirePermissions('system:oauth2:update')
  @Log({ module: 'system_oauth2_client', type: 'UPDATE', description: '修改 OAuth2 客户端' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.updateClient(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:oauth2:delete')
  @Log({ module: 'system_oauth2_client', type: 'DELETE', description: '删除 OAuth2 客户端' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeClient(id);
  }
}
