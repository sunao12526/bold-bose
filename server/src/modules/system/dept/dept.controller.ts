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
import { DeptService } from './dept.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { DeptQueryDto } from '../dto/dept-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/dept')
export class DeptController {
  constructor(private readonly service: DeptService) {}

  @Post()
  @RequirePermissions('system:dept:create')
  @Log({ module: 'system_dept', type: 'CREATE', description: '创建部门' })
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  @RequirePermissions('system:dept:query')
  async findAll(@Query() query: DeptQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:dept:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:dept:update')
  @Log({ module: 'system_dept', type: 'UPDATE', description: '修改部门' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:dept:delete')
  @Log({ module: 'system_dept', type: 'DELETE', description: '删除部门' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
