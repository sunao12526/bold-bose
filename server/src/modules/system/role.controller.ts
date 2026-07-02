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
import { RoleService } from './role.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { RoleQueryDto } from './dto/role-query.dto';
import { CreateRoleDto, UpdateRoleDto, AssignRoleMenusDto } from './dto/role-input.dto';
import { RoleResponseDto, RoleListResponseDto } from './dto/role-response.dto';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';

@ApiTags('系统 - 角色管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @RequirePermissions('system:role:create')
  @Log({ module: '角色管理', type: 'CREATE', description: '创建角色' })
  @ApiOperation({ summary: '创建角色' })
  @ApiOkResponse({ type: RoleResponseDto })
  async create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data);
  }

  @Get()
  @RequirePermissions('system:role:query')
  @ApiOperation({ summary: '分页查询角色列表' })
  @ApiOkResponse({ type: RoleListResponseDto })
  async findAll(@Query() query: RoleQueryDto) {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:role:query')
  @ApiOperation({ summary: '根据 ID 获取角色详情' })
  @ApiOkResponse({ type: RoleResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:role:update')
  @Log({ module: '角色管理', type: 'UPDATE', description: '修改角色' })
  @ApiOperation({ summary: '修改角色' })
  @ApiOkResponse({ type: RoleResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto) {
    return this.roleService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:role:delete')
  @Log({ module: '角色管理', type: 'DELETE', description: '删除角色' })
  @ApiOperation({ summary: '删除角色' })
  @ApiOkResponse({ type: RoleResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  @Post(':id/assign-menus')
  @RequirePermissions('system:role:update')
  @Log({ module: '角色管理', type: 'UPDATE', description: '分配角色菜单权限' })
  @ApiOperation({ summary: '分配角色菜单权限' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async assignMenus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignRoleMenusDto,
  ) {
    return this.roleService.assignMenus(id, body.menuIds);
  }
}

