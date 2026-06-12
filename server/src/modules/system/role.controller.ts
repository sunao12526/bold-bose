import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @RequirePermissions('system:role:create')
  @Log({ module: '角色管理', type: 'CREATE', description: '创建角色' })
  async create(@Body() data: any) {
    return this.roleService.create(data);
  }

  @Get()
  @RequirePermissions('system:role:query')
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @RequirePermissions('system:role:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:role:update')
  @Log({ module: '角色管理', type: 'UPDATE', description: '修改角色' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.roleService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:role:delete')
  @Log({ module: '角色管理', type: 'DELETE', description: '删除角色' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  @Post(':id/assign-menus')
  @RequirePermissions('system:role:update')
  @Log({ module: '角色管理', type: 'UPDATE', description: '分配角色菜单权限' })
  async assignMenus(
    @Param('id', ParseIntPipe) id: number,
    @Body('menuIds') menuIds: number[],
  ) {
    return this.roleService.assignMenus(id, menuIds);
  }
}
