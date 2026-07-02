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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CreateJobDto, UpdateJobDto } from '../dto/job-input.dto';
import { JobResponseDto } from '../dto/job-response.dto';
import { SuccessResponseDto } from '../../auth/dto/auth-response.dto';

@ApiTags('基础设施 - 定时任务配置')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @RequirePermissions('infra:job:create')
  @Log({ module: '定时任务', type: 'CREATE', description: '创建定时任务' })
  @ApiOperation({ summary: '创建定时任务' })
  @ApiOkResponse({ type: JobResponseDto })
  async create(@Body() data: CreateJobDto) {
    return this.jobService.create(data);
  }

  @Get()
  @RequirePermissions('infra:job:query')
  @ApiOperation({ summary: '获取所有定时任务列表' })
  @ApiOkResponse({ type: JobResponseDto, isArray: true })
  async findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  @RequirePermissions('infra:job:query')
  @ApiOperation({ summary: '根据 ID 获取定时任务详情' })
  @ApiOkResponse({ type: JobResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('infra:job:update')
  @Log({ module: '定时任务', type: 'UPDATE', description: '修改定时任务' })
  @ApiOperation({ summary: '修改定时任务' })
  @ApiOkResponse({ type: JobResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateJobDto) {
    return this.jobService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('infra:job:delete')
  @Log({ module: '定时任务', type: 'DELETE', description: '删除定时任务' })
  @ApiOperation({ summary: '删除定时任务' })
  @ApiOkResponse({ type: JobResponseDto })
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
  @ApiOperation({ summary: '手动触发执行一次定时任务' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async executeOnce(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.executeOnce(id);
  }
}

