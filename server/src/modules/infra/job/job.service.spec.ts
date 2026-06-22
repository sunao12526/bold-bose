import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobHandlers } from './job.handlers';
import { CronJob } from 'cron';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('cron');

describe('JobService', () => {
  let service: JobService;

  const mockPrismaService = {
    sysJob: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    sysJobLog: {
      create: jest.fn(),
    },
  };

  const mockSchedulerRegistry = {
    addCronJob: jest.fn(),
    getCronJobs: jest.fn().mockReturnValue(new Map()),
    getCronJob: jest.fn(),
    deleteCronJob: jest.fn(),
  };

  const mockJobHandlers = {
    demoTaskJob: jest.fn(),
    testErrorJob: jest.fn().mockRejectedValue(new Error('Test execution error')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SchedulerRegistry, useValue: mockSchedulerRegistry },
        { provide: JobHandlers, useValue: mockJobHandlers },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (service as any).runningJobs.clear();
  });

  describe('onApplicationBootstrap', () => {
    it('应该加载所有 ENABLE 的定时任务并注册', async () => {
      const activeJobs = [
        { id: 1, name: 'Job 1', cronExpression: '0 * * * * *', handlerName: 'demoTaskJob', status: 'ENABLE' },
        { id: 2, name: 'Job 2', cronExpression: '0 0 * * * *', handlerName: 'demoTaskJob', status: 'ENABLE' },
      ];
      mockPrismaService.sysJob.findMany.mockResolvedValue(activeJobs);
      jest.spyOn(service, 'registerJob').mockResolvedValue(undefined);

      await service.onApplicationBootstrap();

      expect(mockPrismaService.sysJob.findMany).toHaveBeenCalledWith({
        where: { status: 'ENABLE' },
      });
      expect(service.registerJob).toHaveBeenCalledTimes(2);
    });
  });

  describe('registerJob', () => {
    it('应该注册并启动 CronJob', async () => {
      const jobRecord = {
        id: 42,
        name: 'Test Registry Job',
        cronExpression: '* * * * * *',
        handlerName: 'demoTaskJob',
      };
      jest.spyOn(service, 'unregisterJob').mockImplementation(() => {});

      await service.registerJob(jobRecord);

      expect(service.unregisterJob).toHaveBeenCalledWith(42);
      expect(mockSchedulerRegistry.addCronJob).toHaveBeenCalledWith(
        'JOB_42',
        expect.any(CronJob),
      );

      // Stop the registered CronJob to prevent it from executing in background
      const registeredJob = mockSchedulerRegistry.addCronJob.mock.calls[0][1];
      registeredJob.stop();
    });

    it('如果 CronJob 初始化抛出错误，应该捕获并用 logger 打印', async () => {
      (CronJob as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid cron expression');
      });
      const jobRecord = {
        id: 43,
        name: 'Invalid Job',
        cronExpression: 'invalid_expression',
        handlerName: 'demoTaskJob',
      };
      jest.spyOn(service, 'unregisterJob').mockImplementation(() => {});

      await service.registerJob(jobRecord);

      // Should not throw, should log instead
      expect(mockSchedulerRegistry.addCronJob).not.toHaveBeenCalled();
    });
  });

  describe('unregisterJob', () => {
    it('如果任务在注册表里，应该停止并注销它', () => {
      const jobName = 'JOB_10';
      const mockCronInstance = { stop: jest.fn() };

      mockSchedulerRegistry.getCronJobs.mockReturnValue(new Map([[jobName, mockCronInstance]]));
      mockSchedulerRegistry.getCronJob.mockReturnValue(mockCronInstance);

      service.unregisterJob(10);

      expect(mockCronInstance.stop).toHaveBeenCalled();
      expect(mockSchedulerRegistry.deleteCronJob).toHaveBeenCalledWith(jobName);
    });

    it('如果任务不存在于注册表，什么都不做', () => {
      mockSchedulerRegistry.getCronJobs.mockReturnValue(new Map());

      service.unregisterJob(999);

      expect(mockSchedulerRegistry.getCronJob).not.toHaveBeenCalled();
    });

    it('如果删除任务过程中抛出异常，应该捕获它', () => {
      const jobName = 'JOB_10';
      const mockCronInstance = { stop: jest.fn() };
      mockSchedulerRegistry.getCronJobs.mockReturnValue(new Map([[jobName, mockCronInstance]]));
      mockSchedulerRegistry.getCronJob.mockReturnValue(mockCronInstance);
      mockSchedulerRegistry.deleteCronJob.mockImplementation(() => {
        throw new Error('Registry delete error');
      });

      // Should not throw
      service.unregisterJob(10);
    });
  });

  describe('runJobWrapper', () => {
    it('防重复并发锁：如果同一个任务已经在运行中，应该直接跳过', async () => {
      const lockKey = '55_demoTaskJob';
      (service as any).runningJobs.add(lockKey);

      await service.runJobWrapper(55, 'demoTaskJob');

      // The handler should not be called
      expect(mockJobHandlers.demoTaskJob).not.toHaveBeenCalled();
      expect(mockPrismaService.sysJobLog.create).not.toHaveBeenCalled();
    });

    it('应该成功运行 Handler 并写入 SUCCESS 状态 200 日志', async () => {
      mockJobHandlers.demoTaskJob.mockResolvedValue(undefined);
      mockPrismaService.sysJobLog.create.mockResolvedValue({});

      await service.runJobWrapper(88, 'demoTaskJob');

      expect(mockJobHandlers.demoTaskJob).toHaveBeenCalled();
      expect(mockPrismaService.sysJobLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            jobId: 88,
            handlerName: 'demoTaskJob',
            status: 200,
            errorMessage: null,
          }),
        }),
      );
    });

    it('如果 Handler 不存在，应该记录 status 为 500 并记录错误原因', async () => {
      mockPrismaService.sysJobLog.create.mockResolvedValue({});

      await service.runJobWrapper(99, 'nonExistentJob');

      expect(mockPrismaService.sysJobLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            jobId: 99,
            handlerName: 'nonExistentJob',
            status: 500,
            errorMessage: 'Handler name "nonExistentJob" is not a valid method on JobHandlers.',
          }),
        }),
      );
    });

    it('如果 Handler 执行抛出异常，应该捕获并记录 status 为 500 以及堆栈信息', async () => {
      mockPrismaService.sysJobLog.create.mockResolvedValue({});

      await service.runJobWrapper(77, 'testErrorJob');

      expect(mockJobHandlers.testErrorJob).toHaveBeenCalled();
      expect(mockPrismaService.sysJobLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            jobId: 77,
            handlerName: 'testErrorJob',
            status: 500,
            errorMessage: 'Test execution error',
          }),
        }),
      );
    });

    it('如果写入运行日志抛出异常，应该安全捕获不影响其他任务', async () => {
      mockJobHandlers.demoTaskJob.mockResolvedValue(undefined);
      mockPrismaService.sysJobLog.create.mockRejectedValue(new Error('Database write failure'));

      // Should run successfully and not crash
      await service.runJobWrapper(100, 'demoTaskJob');
    });
  });

  describe('CRUD operations & Manual execution', () => {
    describe('create', () => {
      it('如果 cron 表达式无效，应该抛出 BadRequestException', async () => {
        (CronJob as jest.Mock).mockImplementationOnce(() => {
          throw new Error('Invalid cron expression');
        });
        await expect(service.create({ cronExpression: 'invalid' })).rejects.toThrow(
          BadRequestException,
        );
      });

      it('如果 ENABLE 状态且 cron 表达式有效，应该创建并调用 registerJob', async () => {
        const data = {
          cronExpression: '0 * * * * *',
          status: 'ENABLE',
        };
        const mockJob = { id: 10, ...data };
        mockPrismaService.sysJob.create.mockResolvedValue(mockJob);
        jest.spyOn(service, 'registerJob').mockResolvedValue(undefined);

        const res = await service.create(data);
        expect(res).toEqual(mockJob);
        expect(service.registerJob).toHaveBeenCalledWith(mockJob);
      });
    });

    describe('findAll', () => {
      it('应该返回所有定时任务列表', async () => {
        mockPrismaService.sysJob.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        const res = await service.findAll();
        expect(res.length).toBe(2);
      });
    });

    describe('findOne', () => {
      it('如果不存在应抛出 NotFoundException', async () => {
        mockPrismaService.sysJob.findUnique.mockResolvedValue(null);
        await expect(service.findOne(99)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('如果存在应返回', async () => {
        mockPrismaService.sysJob.findUnique.mockResolvedValue({ id: 1 });
        const res = await service.findOne(1);
        expect(res.id).toBe(1);
      });
    });

    describe('update', () => {
      it('如果传入了新的且无效的 cron 表达式，应该抛出 BadRequestException', async () => {
        mockPrismaService.sysJob.findUnique.mockResolvedValue({ id: 1 });
        (CronJob as jest.Mock).mockImplementationOnce(() => {
          throw new Error('Invalid cron expression');
        });
        await expect(service.update(1, { cronExpression: 'invalid' })).rejects.toThrow(
          BadRequestException,
        );
      });

      it('如果更新后是 ENABLE 状态，应该注册', async () => {
        const mockJob = { id: 1, status: 'ENABLE' };
        mockPrismaService.sysJob.findUnique.mockResolvedValue({ id: 1 });
        mockPrismaService.sysJob.update.mockResolvedValue(mockJob);
        jest.spyOn(service, 'registerJob').mockResolvedValue(undefined);

        await service.update(1, { status: 'ENABLE' });
        expect(service.registerJob).toHaveBeenCalledWith(mockJob);
      });

      it('如果更新后是 DISABLE 状态，应该注销', async () => {
        const mockJob = { id: 1, status: 'DISABLE' };
        mockPrismaService.sysJob.findUnique.mockResolvedValue({ id: 1 });
        mockPrismaService.sysJob.update.mockResolvedValue(mockJob);
        jest.spyOn(service, 'unregisterJob').mockImplementation(() => {});

        await service.update(1, { status: 'DISABLE' });
        expect(service.unregisterJob).toHaveBeenCalledWith(1);
      });
    });

    describe('remove', () => {
      it('应该注销任务并将其从数据库中删除', async () => {
        mockPrismaService.sysJob.findUnique.mockResolvedValue({ id: 5 });
        mockPrismaService.sysJob.delete.mockResolvedValue({ id: 5 });
        jest.spyOn(service, 'unregisterJob').mockImplementation(() => {});

        await service.remove(5);
        expect(service.unregisterJob).toHaveBeenCalledWith(5);
        expect(mockPrismaService.sysJob.delete).toHaveBeenCalledWith({ where: { id: 5 } });
      });
    });

    describe('executeOnce', () => {
      it('应该直接调用 runJobWrapper 异步触发任务执行', async () => {
        mockPrismaService.sysJob.findUnique.mockResolvedValue({ id: 6, handlerName: 'demoTaskJob' });
        jest.spyOn(service, 'runJobWrapper').mockResolvedValue(undefined);

        const res = await service.executeOnce(6);
        expect(res.success).toBe(true);
        expect(service.runJobWrapper).toHaveBeenCalledWith(6, 'demoTaskJob');
      });
    });

    describe('findAllLogs', () => {
      it('应该返回所有定时任务运行日志', async () => {
        mockPrismaService.sysJobLog.findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
        const res = await service.findAllLogs();
        expect(res.length).toBe(1);
      });
    });
  });
});
