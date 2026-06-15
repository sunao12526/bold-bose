import {
  Injectable,
  OnApplicationBootstrap,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { JobHandlers } from './job.handlers';
import { CronJob } from 'cron';

@Injectable()
export class JobService implements OnApplicationBootstrap {
  private runningJobs = new Set<string>();

  constructor(
    private prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
    private jobHandlers: JobHandlers,
  ) {}

  // 1. Lifecycle hook: Bootstrap all active jobs from DB
  async onApplicationBootstrap() {
    const jobs = await this.prisma.sysJob.findMany({
      where: { status: 'ENABLE' },
    });
    for (const job of jobs) {
      await this.registerJob(job);
    }
    console.log(
      `[Scheduler] Loaded and registered ${jobs.length} active cron jobs.`,
    );
  }

  // 2. Register a cron job in NestJS SchedulerRegistry
  async registerJob(jobRecord: any) {
    const jobName = `JOB_${jobRecord.id}`;

    // Unregister first if exists
    this.unregisterJob(jobRecord.id);

    try {
      const job = new CronJob(jobRecord.cronExpression, async () => {
        await this.runJobWrapper(jobRecord.id, jobRecord.handlerName);
      });

      this.schedulerRegistry.addCronJob(jobName, job);
      job.start();
    } catch (e) {
      console.error(
        `[Scheduler] Failed to register job "${jobRecord.name}":`,
        e.message,
      );
    }
  }

  unregisterJob(jobId: number) {
    const jobName = `JOB_${jobId}`;
    if (this.schedulerRegistry.getCronJobs().has(jobName)) {
      try {
        const job = this.schedulerRegistry.getCronJob(jobName);
        job.stop();
        this.schedulerRegistry.deleteCronJob(jobName);
      } catch (e: any) {
        console.error(
          `[Scheduler] Error deleting job "${jobName}":`,
          e.message,
        );
      }
    }
  }

  // 4. Job runner wrapper with locking, timing, error handling and DB logging
  async runJobWrapper(jobId: number, handlerName: string) {
    const lockKey = `${jobId}_${handlerName}`;
    if (this.runningJobs.has(lockKey)) {
      console.warn(
        `[Scheduler] Job ${handlerName} (ID: ${jobId}) is already running, skipping execution.`,
      );
      return;
    }
    this.runningJobs.add(lockKey);

    const startTime = Date.now();
    let status = 200;
    let errorMessage: string | null = null;

    try {
      const handler = (this.jobHandlers as any)[handlerName];
      if (typeof handler !== 'function') {
        throw new Error(
          `Handler name "${handlerName}" is not a valid method on JobHandlers.`,
        );
      }
      await handler.call(this.jobHandlers);
    } catch (err: any) {
      status = 500;
      errorMessage = err.message || String(err);
      console.error(`[Scheduler] Error executing job "${handlerName}":`, err);
    } finally {
      const duration = Date.now() - startTime;
      this.runningJobs.delete(lockKey);

      // Save execution log
      try {
        await this.prisma.sysJobLog.create({
          data: {
            jobId,
            handlerName,
            status,
            duration,
            errorMessage: errorMessage ? errorMessage.substring(0, 2000) : null,
          },
        });
      } catch (logErr) {
        console.error('[Scheduler] Failed to write job log:', logErr);
      }
    }
  }

  // --- CRUD Services ---

  async create(data: any) {
    // Validate cron expression
    try {
      new CronJob(data.cronExpression, () => {});
    } catch (e) {
      throw new BadRequestException('无效的 Cron 表达式');
    }

    const job = await this.prisma.sysJob.create({ data });
    if (job.status === 'ENABLE') {
      await this.registerJob(job);
    }
    return job;
  }

  async findAll() {
    return this.prisma.sysJob.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const job = await this.prisma.sysJob.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('任务配置不存在');
    return job;
  }

  async update(id: number, data: any) {
    const existing = await this.findOne(id);

    if (data.cronExpression) {
      try {
        new CronJob(data.cronExpression, () => {});
      } catch (e) {
        throw new BadRequestException('无效的 Cron 表达式');
      }
    }

    const job = await this.prisma.sysJob.update({
      where: { id },
      data,
    });

    if (job.status === 'ENABLE') {
      await this.registerJob(job);
    } else {
      this.unregisterJob(job.id);
    }

    return job;
  }

  async remove(id: number) {
    const job = await this.findOne(id);
    this.unregisterJob(job.id);
    return this.prisma.sysJob.delete({ where: { id } });
  }

  async executeOnce(id: number) {
    const job = await this.findOne(id);
    // Execute asynchronously
    this.runJobWrapper(job.id, job.handlerName);
    return { success: true };
  }

  async findAllLogs() {
    return this.prisma.sysJobLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200, // Limit log list to most recent 200 items
    });
  }
}
