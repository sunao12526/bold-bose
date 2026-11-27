import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import type { Response } from 'express';
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
import { Keep } from '../../shared/decorators/keep.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { ExcelService } from '../../shared/excel/excel.service';
import { RoleQueryDto } from './dto/role-query.dto';
import { CreateRoleDto, UpdateRoleDto, AssignRoleMenusDto } from './dto/role-input.dto';
import { RoleResponseDto, RoleListResponseDto } from './dto/role-response.dto';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';

@ApiTags('系统 - 角色管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/role')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private excelService: ExcelService,
  ) {}

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

  @Get('export-excel')
  @Keep()
  @RequirePermissions('system:role:export')
  @ApiOperation({ summary: '导出角色列表 Excel' })
  async exportExcel(@Query() query: RoleQueryDto, @Res() res: Response) {
    const rows = await this.roleService.findAllForExport(query);
    this.excelService.sendExcelResponse(
      res,
      '角色列表.xlsx',
      rows,
      [
        { header: '角色编号', key: 'id', width: 10 },
        { header: '角色名称', key: 'name', width: 20 },
        { header: '角色标识', key: 'code', width: 20 },
        { header: '显示顺序', key: 'sort', width: 10 },
        {
          header: '状态',
          key: 'status',
          width: 10,
          formatter: (r) => (r.status === 'ENABLE' ? '启用' : '禁用'),
        },
        { header: '备注', key: 'remark', width: 28 },
        { header: '创建时间', key: 'createdAt', width: 22 },
      ],
      '角色列表',
    );
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

