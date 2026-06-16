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
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @RequirePermissions('system:user:create')
  @Log({ module: '用户管理', type: 'CREATE', description: '创建用户' })
  async create(@Body() data: any) {
    return this.userService.create(data);
  }

  @Get()
  @RequirePermissions('system:user:query')
  async findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:user:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:user:update')
  @Log({ module: '用户管理', type: 'UPDATE', description: '修改用户' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:user:delete')
  @Log({ module: '用户管理', type: 'DELETE', description: '删除用户' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post(':id/assign-roles')
  @RequirePermissions('system:user:update')
  @Log({ module: '用户管理', type: 'UPDATE', description: '分配用户角色' })
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleIds') roleIds: number[],
  ) {
    return this.userService.assignRoles(id, roleIds);
  }
}
