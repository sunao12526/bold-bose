import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { paginateQuery } from '../../shared/pagination';
import { SseService } from '../../shared/sse/sse.service';
import { BpmNodeConfig } from './dto/bpm.dto';

export const BpmStatus = {
  RUNNING: 1,
  APPROVED: 2,
  REJECTED: 3,
  CANCELLED: 4,
  TRANSFERRED: 5,
} as const;

@Injectable()
export class BpmEngineService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly sseService?: SseService,
  ) {}

  private async resolveAssignees(
    node: BpmNodeConfig,
    startUserId: number,
  ): Promise<number[]> {
    const type = node.assigneeType || 'USER';
    if (type === 'USER') {
      return Array.from(new Set(node.assigneeIds || [])).filter((id) => id > 0);
    }

    if (type === 'ROLE') {
      const roleIds = node.assigneeIds || [];
      if (roleIds.length === 0) return [];
      const userRoles = await this.prisma.userRole.findMany({
        where: { roleId: { in: roleIds } },
        select: { userId: true },
      });
      return Array.from(new Set(userRoles.map((ur) => ur.userId)));
    }

    if (type === 'DEPT_LEADER') {
      const user = await this.prisma.user.findUnique({
        where: { id: startUserId },
        include: { dept: { select: { leaderId: true } } },
      });
      if (user?.dept?.leaderId) {
        return [user.dept.leaderId];
      }
      return [];
    }

    return [];
  }

  private async syncBusinessStatus(instanceId: number, status: number) {
    await this.prisma.bpmOaLeave.updateMany({
      where: { processInstanceId: instanceId },
      data: { status },
    });
  }

  private async advanceNodes(
    tx: any,
    instance: { id: number; name: string; startUserId: number },
    nodes: BpmNodeConfig[],
    startIndex: number,
  ) {
    for (let idx = startIndex; idx < nodes.length; idx++) {
      const node = nodes[idx];
      const assignees = await this.resolveAssignees(node, instance.startUserId);

      if (node.type === 'CC') {
        if (assignees.length > 0) {
          await tx.bpmProcessInstanceCopy.createMany({
            data: assignees.map((uid) => ({
              processInstanceId: instance.id,
              processInstanceName: instance.name,
              startUserId: instance.startUserId,
              userId: uid,
              nodeKey: node.nodeKey,
              nodeName: node.name,
            })),
          });
          for (const uid of assignees) {
            this.sseService?.sendToUser(
              uid,
              'bpm_cc',
              {
                processInstanceId: instance.id,
                processInstanceName: instance.name,
                nodeName: node.name,
              },
              2,
            );
          }
        }
        continue;
      }

      if (assignees.length === 0) {
        throw new BadRequestException(
          `审批节点 [${node.name}] 未找到有效审批人`,
        );
      }

      await tx.bpmTask.createMany({
        data: assignees.map((uid) => ({
          processInstanceId: instance.id,
          nodeKey: node.nodeKey,
          nodeName: node.name,
          nodeIndex: idx,
          assigneeUserId: uid,
          status: BpmStatus.RUNNING,
        })),
      });

      await tx.bpmProcessInstance.update({
        where: { id: instance.id },
        data: { currentNodeIndex: idx },
      });

      for (const uid of assignees) {
        this.sseService?.sendToUser(
          uid,
          'bpm_task',
          {
            processInstanceId: instance.id,
            processInstanceName: instance.name,
            nodeName: node.name,
          },
          2,
        );
      }
      return;
    }

    // 所有节点处理完毕，流程自动结束并通过
    await tx.bpmProcessInstance.update({
      where: { id: instance.id },
      data: {
        status: BpmStatus.APPROVED,
        endTime: new Date(),
      },
    });
    await tx.bpmOaLeave.updateMany({
      where: { processInstanceId: instance.id },
      data: { status: BpmStatus.APPROVED },
    });
  }

  async startProcessInstance(
    startUserId: number,
    data: {
      modelKey: string;
      name?: string;
      formVariables?: Record<string, any>;
      businessKey?: string;
    },
  ) {
    const model = await this.prisma.bpmModel.findUnique({
      where: { key: data.modelKey },
    });
    if (!model || model.status !== CommonStatus.ENABLE) {
      throw new NotFoundException(`流程模型 [${data.modelKey}] 不存在或已禁用`);
    }
    if (!model.deployed) {
      throw new BadRequestException(`流程模型 [${model.name}] 尚未部署发布`);
    }

    const nodes = (Array.isArray(model.nodes) ? model.nodes : []) as BpmNodeConfig[];
    if (nodes.length === 0) {
      throw new BadRequestException('流程模型未配置任何审批节点');
    }

    const instanceName = data.name || `${model.name}`;

    return this.prisma.$transaction(async (tx) => {
      const instance = await tx.bpmProcessInstance.create({
        data: {
          modelId: model.id,
          modelKey: model.key,
          name: instanceName,
          categoryCode: model.categoryCode,
          startUserId,
          status: BpmStatus.RUNNING,
          formVariables: data.formVariables ?? {},
          businessKey: data.businessKey ?? null,
          currentNodeIndex: 0,
        },
      });

      await this.advanceNodes(tx, instance, nodes, 0);

      return tx.bpmProcessInstance.findUnique({
        where: { id: instance.id },
        include: { tasks: { orderBy: { id: 'asc' } } },
      });
    });
  }

  async approveTask(userId: number, taskId: number, reason = '') {
    const task = await this.prisma.bpmTask.findUnique({
      where: { id: taskId },
      include: { processInstance: { include: { model: true } } },
    });
    if (!task) throw new NotFoundException('审批任务不存在');
    if (task.assigneeUserId !== userId) {
      throw new ForbiddenException('您不是该任务的审批人');
    }
    if (task.status !== BpmStatus.RUNNING) {
      throw new BadRequestException('该任务已处理，请勿重复审批');
    }
    if (task.processInstance.status !== BpmStatus.RUNNING) {
      throw new BadRequestException('流程实例已结束');
    }

    const nodes = (Array.isArray(task.processInstance.model.nodes)
      ? task.processInstance.model.nodes
      : []) as BpmNodeConfig[];
    const currentNode = nodes[task.nodeIndex];
    const isAndSign = currentNode?.approveType === 'AND';

    return this.prisma.$transaction(async (tx) => {
      await tx.bpmTask.update({
        where: { id: taskId },
        data: {
          status: BpmStatus.APPROVED,
          reason,
          endTime: new Date(),
        },
      });

      if (isAndSign) {
        const pendingCount = await tx.bpmTask.count({
          where: {
            processInstanceId: task.processInstanceId,
            nodeIndex: task.nodeIndex,
            status: BpmStatus.RUNNING,
          },
        });
        if (pendingCount > 0) {
          return { finishedNode: false, processInstanceId: task.processInstanceId };
        }
      } else {
        // 或签：自动取消同节点其他待办任务
        await tx.bpmTask.updateMany({
          where: {
            processInstanceId: task.processInstanceId,
            nodeIndex: task.nodeIndex,
            id: { not: taskId },
            status: BpmStatus.RUNNING,
          },
          data: {
            status: BpmStatus.CANCELLED,
            endTime: new Date(),
          },
        });
      }

      await this.advanceNodes(
        tx,
        task.processInstance,
        nodes,
        task.nodeIndex + 1,
      );

      return { finishedNode: true, processInstanceId: task.processInstanceId };
    });
  }

  async rejectTask(userId: number, taskId: number, reason = '') {
    const task = await this.prisma.bpmTask.findUnique({
      where: { id: taskId },
      include: { processInstance: true },
    });
    if (!task) throw new NotFoundException('审批任务不存在');
    if (task.assigneeUserId !== userId) {
      throw new ForbiddenException('您不是该任务的审批人');
    }
    if (task.status !== BpmStatus.RUNNING) {
      throw new BadRequestException('该任务已处理');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.bpmTask.update({
        where: { id: taskId },
        data: {
          status: BpmStatus.REJECTED,
          reason,
          endTime: new Date(),
        },
      });

      await tx.bpmTask.updateMany({
        where: {
          processInstanceId: task.processInstanceId,
          id: { not: taskId },
          status: BpmStatus.RUNNING,
        },
        data: {
          status: BpmStatus.CANCELLED,
          endTime: new Date(),
        },
      });

      await tx.bpmProcessInstance.update({
        where: { id: task.processInstanceId },
        data: {
          status: BpmStatus.REJECTED,
          endTime: new Date(),
        },
      });

      await tx.bpmOaLeave.updateMany({
        where: { processInstanceId: task.processInstanceId },
        data: { status: BpmStatus.REJECTED },
      });
    });

    return { success: true };
  }

  async transferTask(
    userId: number,
    taskId: number,
    targetUserId: number,
    reason = '',
  ) {
    const task = await this.prisma.bpmTask.findUnique({
      where: { id: taskId },
      include: { processInstance: true },
    });
    if (!task) throw new NotFoundException('审批任务不存在');
    if (task.assigneeUserId !== userId) {
      throw new ForbiddenException('您不是该任务的审批人');
    }
    if (task.status !== BpmStatus.RUNNING) {
      throw new BadRequestException('只有审批中的任务才能转办');
    }
    if (targetUserId === userId) {
      throw new BadRequestException('不能转办给自己');
    }

    const newTask = await this.prisma.$transaction(async (tx) => {
      await tx.bpmTask.update({
        where: { id: taskId },
        data: {
          status: BpmStatus.TRANSFERRED,
          reason: reason || `转办给用户 #${targetUserId}`,
          endTime: new Date(),
        },
      });

      return tx.bpmTask.create({
        data: {
          processInstanceId: task.processInstanceId,
          nodeKey: task.nodeKey,
          nodeName: task.nodeName,
          nodeIndex: task.nodeIndex,
          assigneeUserId: targetUserId,
          status: BpmStatus.RUNNING,
        },
      });
    });

    this.sseService?.sendToUser(
      targetUserId,
      'bpm_task',
      {
        processInstanceId: task.processInstanceId,
        processInstanceName: task.processInstance.name,
        nodeName: task.nodeName,
      },
      2,
    );

    return newTask;
  }

  async cancelProcessInstance(userId: number, instanceId: number, reason = '') {
    const instance = await this.prisma.bpmProcessInstance.findUnique({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException('流程实例不存在');
    if (instance.startUserId !== userId) {
      throw new ForbiddenException('只有流程发起人才能撤回');
    }
    if (instance.status !== BpmStatus.RUNNING) {
      throw new BadRequestException('流程已结束，无法撤回');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.bpmProcessInstance.update({
        where: { id: instanceId },
        data: {
          status: BpmStatus.CANCELLED,
          endTime: new Date(),
        },
      });

      await tx.bpmTask.updateMany({
        where: { processInstanceId: instanceId, status: BpmStatus.RUNNING },
        data: {
          status: BpmStatus.CANCELLED,
          reason: reason || '发起人撤回流程',
          endTime: new Date(),
        },
      });

      await tx.bpmOaLeave.updateMany({
        where: { processInstanceId: instanceId },
        data: { status: BpmStatus.CANCELLED },
      });
    });

    return { success: true };
  }

  // ================= Queries =================

  async findInstances(query?: any, startUserId?: number) {
    const where: any = {};
    if (startUserId) where.startUserId = startUserId;
    if (query?.name) where.name = { contains: query.name };
    if (query?.status !== undefined && query.status !== '') {
      where.status = Number(query.status);
    }
    if (query?.categoryCode) where.categoryCode = query.categoryCode;

    return paginateQuery(this.prisma, 'bpmProcessInstance', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  async getInstanceDetail(id: number) {
    const instance = await this.prisma.bpmProcessInstance.findUnique({
      where: { id },
      include: {
        model: true,
        tasks: { orderBy: { id: 'asc' } },
        copies: { orderBy: { id: 'asc' } },
      },
    });
    if (!instance) throw new NotFoundException('流程实例不存在');
    return instance;
  }

  async findMyTodoTasks(userId: number, query?: any) {
    return paginateQuery(this.prisma, 'bpmTask', query || {}, {
      where: { assigneeUserId: userId, status: BpmStatus.RUNNING },
      include: { processInstance: true },
      orderBy: { id: 'desc' },
    });
  }

  async findMyDoneTasks(userId: number, query?: any) {
    return paginateQuery(this.prisma, 'bpmTask', query || {}, {
      where: {
        assigneeUserId: userId,
        status: { not: BpmStatus.RUNNING },
      },
      include: { processInstance: true },
      orderBy: { endTime: 'desc' },
    });
  }

  async findMyCopies(userId: number, query?: any) {
    return paginateQuery(this.prisma, 'bpmProcessInstanceCopy', query || {}, {
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }

  async markCopyRead(userId: number, copyId: number) {
    const copy = await this.prisma.bpmProcessInstanceCopy.findFirst({
      where: { id: copyId, userId },
    });
    if (!copy) throw new NotFoundException('抄送记录不存在');
    return this.prisma.bpmProcessInstanceCopy.update({
      where: { id: copyId },
      data: { read: true },
    });
  }

  // ================= OA Leave Demo =================

  async createOaLeave(
    userId: number,
    data: {
      type: number;
      reason: string;
      startTime: Date;
      endTime: Date;
      day: number;
    },
  ) {
    const leave = await this.prisma.bpmOaLeave.create({
      data: {
        userId,
        type: data.type,
        reason: data.reason,
        startTime: data.startTime,
        endTime: data.endTime,
        day: data.day,
        status: BpmStatus.RUNNING,
      },
    });

    // 若已配置并部署了 key='oa_leave' 的流程模型，则自动发起审批流
    const model = await this.prisma.bpmModel.findUnique({
      where: { key: 'oa_leave' },
    });
    if (model && model.deployed && model.status === CommonStatus.ENABLE) {
      const instance = await this.startProcessInstance(userId, {
        modelKey: 'oa_leave',
        name: `请假申请 (${data.day}天)`,
        businessKey: `OA_LEAVE_${leave.id}`,
        formVariables: {
          leaveId: leave.id,
          type: data.type,
          day: data.day,
          reason: data.reason,
        },
      });
      return this.prisma.bpmOaLeave.update({
        where: { id: leave.id },
        data: {
          processInstanceId: instance?.id ?? null,
          status: instance?.status ?? BpmStatus.RUNNING,
        },
      });
    }

    return leave;
  }

  async findMyOaLeaves(userId: number, query?: any) {
    return paginateQuery(this.prisma, 'bpmOaLeave', query || {}, {
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }

  async findOaLeaveById(id: number) {
    const leave = await this.prisma.bpmOaLeave.findUnique({ where: { id } });
    if (!leave) throw new NotFoundException('请假申请不存在');
    return leave;
  }
}
