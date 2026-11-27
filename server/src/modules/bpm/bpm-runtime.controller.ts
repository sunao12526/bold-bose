import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { BpmEngineService } from './bpm-engine.service';
import {
  CreateOaLeaveDto,
  StartProcessInstanceDto,
  TaskReasonDto,
  TransferTaskDto,
} from './dto/bpm.dto';

@ApiTags('工作流 - 流程实例')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bpm/process-instance')
export class BpmProcessInstanceController {
  constructor(private readonly engine: BpmEngineService) {}

  @Get('my-page')
  @ApiOperation({ summary: '分页查询我发起的流程实例' })
  async myPage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('name') name?: string,
    @Query('status') status?: string,
  ) {
    return this.engine.findInstances(
      { page, pageSize, name, status },
      req.user.id,
    );
  }

  @Get('page')
  @RequirePermissions('bpm:process-instance:query')
  @ApiOperation({ summary: '管理端分页查询所有流程实例' })
  async managerPage(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('name') name?: string,
    @Query('status') status?: string,
  ) {
    return this.engine.findInstances({ page, pageSize, name, status });
  }

  @Post('create')
  @ApiOperation({ summary: '发起流程实例' })
  async create(@Req() req: any, @Body() body: StartProcessInstanceDto) {
    return this.engine.startProcessInstance(req.user.id, body);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '撤回取消我发起的流程实例' })
  async cancel(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TaskReasonDto,
  ) {
    return this.engine.cancelProcessInstance(req.user.id, id, body?.reason);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取流程实例详情及审批历史' })
  async detail(@Param('id', ParseIntPipe) id: number) {
    return this.engine.getInstanceDetail(id);
  }
}

@ApiTags('工作流 - 审批任务与抄送')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('bpm/task')
export class BpmTaskController {
  constructor(private readonly engine: BpmEngineService) {}

  @Get('todo-page')
  @ApiOperation({ summary: '获取我的待办审批任务' })
  async todoPage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.engine.findMyTodoTasks(req.user.id, { page, pageSize });
  }

  @Get('done-page')
  @ApiOperation({ summary: '获取我的已办审批任务' })
  async donePage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.engine.findMyDoneTasks(req.user.id, { page, pageSize });
  }

  @Get('copy/page')
  @ApiOperation({ summary: '获取抄送我的流程列表' })
  async copyPage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.engine.findMyCopies(req.user.id, { page, pageSize });
  }

  @Put('copy/:id/read')
  @ApiOperation({ summary: '标记抄送为已读' })
  async markCopyRead(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.engine.markCopyRead(req.user.id, id);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: '审批通过任务' })
  async approve(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TaskReasonDto,
  ) {
    return this.engine.approveTask(req.user.id, id, body?.reason);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: '审批驳回任务' })
  async reject(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TaskReasonDto,
  ) {
    return this.engine.rejectTask(req.user.id, id, body?.reason);
  }

  @Put(':id/transfer')
  @ApiOperation({ summary: '转办审批任务' })
  async transfer(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TransferTaskDto,
  ) {
    return this.engine.transferTask(
      req.user.id,
      id,
      body.targetUserId,
      body.reason,
    );
  }
}

@ApiTags('工作流 - OA 请假示例')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('bpm/oa/leave')
export class BpmOaLeaveController {
  constructor(private readonly engine: BpmEngineService) {}

  @Get('my-page')
  @ApiOperation({ summary: '分页查询我的请假记录' })
  async myPage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.engine.findMyOaLeaves(req.user.id, { page, pageSize });
  }

  @Post('create')
  @ApiOperation({ summary: '创建 OA 请假申请（自动触发请假审批流）' })
  async create(@Req() req: any, @Body() body: CreateOaLeaveDto) {
    return this.engine.createOaLeave(req.user.id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取 OA 请假申请详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.engine.findOaLeaveById(id);
  }
}
