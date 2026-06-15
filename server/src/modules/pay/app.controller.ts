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
import { PayAppService } from './app.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CommonStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/app')
export class PayAppController {
  constructor(private appService: PayAppService) {}

  @Post()
  @RequirePermissions('pay:app:create')
  @Log({ module: '支付应用', type: 'CREATE', description: '创建支付应用' })
  async create(
    @Body('name') name: string,
    @Body('code') code: string,
    @Body('status') status: CommonStatus,
    @Body('remark') remark?: string,
  ) {
    return this.appService.create({ name, code, status, remark });
  }

  @Get()
  @RequirePermissions('pay:app:query')
  async findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  @RequirePermissions('pay:app:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('pay:app:update')
  @Log({ module: '支付应用', type: 'UPDATE', description: '更新支付应用' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name?: string,
    @Body('code') code?: string,
    @Body('status') status?: CommonStatus,
    @Body('remark') remark?: string,
  ) {
    return this.appService.update(id, { name, code, status, remark });
  }

  @Delete(':id')
  @RequirePermissions('pay:app:delete')
  @Log({ module: '支付应用', type: 'DELETE', description: '删除支付应用' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.appService.remove(id);
  }
}
