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
import { JobService } from './job.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @RequirePermissions('infra:job:create')
  @Log({ module: '定时任务', type: 'CREATE', description: '创建定时任务' })
  async create(@Body() data: any) {
    return this.jobService.create(data);
  }

  @Get()
  @RequirePermissions('infra:job:query')
  async findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  @RequirePermissions('infra:job:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('infra:job:update')
  @Log({ module: '定时任务', type: 'UPDATE', description: '修改定时任务' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.jobService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('infra:job:delete')
  @Log({ module: '定时任务', type: 'DELETE', description: '删除定时任务' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.remove(id);
  }

  @Post(':id/run')
  @RequirePermissions('infra:job:update')
  @Log({
    module: '定时任务',
    type: 'UPDATE',
    description: '触发执行一次定时任务',
  })
  async executeOnce(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.executeOnce(id);
  }
}
