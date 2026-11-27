import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ApiErrorLogService } from './api-error-log.service';

describe('ApiErrorLogService', () => {
  let service: ApiErrorLogService;

  const mockPrisma = {
    infraApiErrorLog: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiErrorLogService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ApiErrorLogService>(ApiErrorLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updateProcess 应拒绝非法状态值', async () => {
    await expect(service.updateProcess(1, 99, 1)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('updateProcess 对不存在的日志应抛出 NotFoundException', async () => {
    mockPrisma.infraApiErrorLog.findUnique.mockResolvedValueOnce(null);
    await expect(service.updateProcess(404, 1, 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updateProcess 应更新处理状态、处理时间与处理人', async () => {
    mockPrisma.infraApiErrorLog.findUnique.mockResolvedValueOnce({ id: 1, processStatus: 0 });
    mockPrisma.infraApiErrorLog.update.mockResolvedValueOnce({ id: 1, processStatus: 1, processUserId: 7 });

    const res = await service.updateProcess(1, 1, 7);
    expect(res.processStatus).toBe(1);
    expect(mockPrisma.infraApiErrorLog.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({
        processStatus: 1,
        processUserId: 7,
        processTime: expect.any(Date),
      }),
    });
  });
});
