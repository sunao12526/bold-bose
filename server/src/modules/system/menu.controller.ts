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
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  @RequirePermissions('system:menu:create')
  @Log({ module: '菜单管理', type: 'CREATE', description: '创建菜单' })
  async create(@Body() data: any) {
    return this.menuService.create(data);
  }

  @Get()
  @RequirePermissions('system:menu:query')
  async findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @RequirePermissions('system:menu:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:menu:update')
  @Log({ module: '菜单管理', type: 'UPDATE', description: '修改菜单' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.menuService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:menu:delete')
  @Log({ module: '菜单管理', type: 'DELETE', description: '删除菜单' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
