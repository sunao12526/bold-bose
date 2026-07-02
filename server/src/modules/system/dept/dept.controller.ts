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
import { DeptService } from './dept.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { DeptQueryDto } from '../dto/dept-query.dto';
import { CreateDeptDto, UpdateDeptDto } from '../dto/dept-input.dto';
import { DeptResponseDto } from '../dto/dept-response.dto';

@ApiTags('系统 - 部门管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/dept')
export class DeptController {
  constructor(private readonly service: DeptService) {}

  @Post()
  @RequirePermissions('system:dept:create')
  @Log({ module: 'system_dept', type: 'CREATE', description: '创建部门' })
  @ApiOperation({ summary: '创建部门' })
  @ApiOkResponse({ type: DeptResponseDto })
  async create(@Body() data: CreateDeptDto) {
    return this.service.create(data);
  }

  @Get()
  @RequirePermissions('system:dept:query')
  @ApiOperation({ summary: '获取所有部门列表' })
  @ApiOkResponse({ type: DeptResponseDto, isArray: true })
  async findAll(@Query() query: DeptQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:dept:query')
  @ApiOperation({ summary: '根据 ID 获取部门详情' })
  @ApiOkResponse({ type: DeptResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:dept:update')
  @Log({ module: 'system_dept', type: 'UPDATE', description: '修改部门' })
  @ApiOperation({ summary: '修改部门' })
  @ApiOkResponse({ type: DeptResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateDeptDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:dept:delete')
  @Log({ module: 'system_dept', type: 'DELETE', description: '删除部门' })
  @ApiOperation({ summary: '删除部门' })
  @ApiOkResponse({ type: DeptResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

