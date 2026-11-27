import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { SseService } from '../../shared/sse/sse.service';
import { BpmEngineService, BpmStatus } from './bpm-engine.service';

describe('BpmEngineService', () => {
  let service: BpmEngineService;

  const mockTx = {
    bpmProcessInstance: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    bpmTask: {
      createMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    bpmProcessInstanceCopy: {
      createMany: jest.fn(),
    },
    bpmOaLeave: {
      updateMany: jest.fn(),
    },
  };

  const mockPrisma = {
    bpmModel: { findUnique: jest.fn() },
    bpmTask: { findUnique: jest.fn() },
    bpmProcessInstance: { findUnique: jest.fn() },
    bpmOaLeave: { create: jest.fn(), update: jest.fn() },
    userRole: { findMany: jest.fn() },
    user: { findUnique: jest.fn() },
    $transaction: jest.fn((cb: any) => cb(mockTx)),
  };

  const mockSseService = {
    sendToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BpmEngineService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SseService, useValue: mockSseService },
      ],
    }).compile();

    service = module.get<BpmEngineService>(BpmEngineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('startProcessInstance 遇到连续 CC 节点后应在首个 APPROVE 节点生成待办并推送 SSE', async () => {
    mockPrisma.bpmModel.findUnique.mockResolvedValueOnce({
      id: 1,
      key: 'oa_leave',
      name: '请假流',
      categoryCode: 'oa',
      deployed: true,
      status: CommonStatus.ENABLE,
      nodes: [
        { nodeKey: 'cc1', name: '抄送HR', type: 'CC', assigneeType: 'USER', assigneeIds: [99] },
        { nodeKey: 'app1', name: '主管审批', type: 'APPROVE', approveType: 'OR', assigneeType: 'USER', assigneeIds: [2, 3] },
      ],
    });
    mockTx.bpmProcessInstance.create.mockResolvedValueOnce({
      id: 10,
      name: '请假流',
      startUserId: 1,
    });
    mockTx.bpmProcessInstance.findUnique.mockResolvedValueOnce({
      id: 10,
      currentNodeIndex: 1,
    });

    await service.startProcessInstance(1, { modelKey: 'oa_leave' });

    expect(mockTx.bpmProcessInstanceCopy.createMany).toHaveBeenCalledTimes(1);
    expect(mockTx.bpmTask.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ assigneeUserId: 2, nodeIndex: 1 }),
        expect.objectContaining({ assigneeUserId: 3, nodeIndex: 1 }),
      ]),
    });
    expect(mockSseService.sendToUser).toHaveBeenCalledWith(99, 'bpm_cc', expect.any(Object), 2);
    expect(mockSseService.sendToUser).toHaveBeenCalledWith(2, 'bpm_task', expect.any(Object), 2);
  });

  it('approveTask 在末节点通过后应结束流程并同步更新 OA 请假状态', async () => {
    mockPrisma.bpmTask.findUnique.mockResolvedValueOnce({
      id: 50,
      processInstanceId: 10,
      nodeIndex: 0,
      assigneeUserId: 2,
      status: BpmStatus.RUNNING,
      processInstance: {
        id: 10,
        name: '请假流',
        startUserId: 1,
        status: BpmStatus.RUNNING,
        model: {
          nodes: [{ nodeKey: 'app1', name: '主管审批', type: 'APPROVE', approveType: 'OR', assigneeType: 'USER', assigneeIds: [2] }],
        },
      },
    });

    const res = await service.approveTask(2, 50, '同意');
    expect(res.finishedNode).toBe(true);
    expect(mockTx.bpmProcessInstance.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: expect.objectContaining({ status: BpmStatus.APPROVED }),
    });
    expect(mockTx.bpmOaLeave.updateMany).toHaveBeenCalledWith({
      where: { processInstanceId: 10 },
      data: { status: BpmStatus.APPROVED },
    });
  });

  it('非本人审批应抛出 ForbiddenException，未部署模型发起应抛出 BadRequestException', async () => {
    mockPrisma.bpmTask.findUnique.mockResolvedValueOnce({
      id: 50,
      assigneeUserId: 2,
      status: BpmStatus.RUNNING,
      processInstance: { status: BpmStatus.RUNNING },
    });
    await expect(service.approveTask(999, 50, '同意')).rejects.toThrow(
      ForbiddenException,
    );

    mockPrisma.bpmModel.findUnique.mockResolvedValueOnce({
      id: 2,
      key: 'draft',
      name: '草稿流',
      deployed: false,
      status: CommonStatus.ENABLE,
      nodes: [],
    });
    await expect(
      service.startProcessInstance(1, { modelKey: 'draft' }),
    ).rejects.toThrow(BadRequestException);
  });
});
