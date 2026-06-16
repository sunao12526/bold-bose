import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MpAccountService } from './mp-account.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/account')
export class MpAccountController {
  constructor(private service: MpAccountService) {}

  @Post()
  @RequirePermissions('mp:account:create')
  @Log({ module: '公众号管理', type: 'CREATE', description: '创建公众号账号' })
  async create(@Body() data: any) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:account:query')
  async findAll() { return this.service.findAll(); }

  @Get(':id')
  @RequirePermissions('mp:account:query')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:account:update')
  @Log({ module: '公众号管理', type: 'UPDATE', description: '修改公众号账号' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:account:delete')
  @Log({ module: '公众号管理', type: 'DELETE', description: '删除公众号账号' })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
