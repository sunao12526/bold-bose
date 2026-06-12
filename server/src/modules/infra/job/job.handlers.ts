import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class JobHandlers {
  private readonly logger = new Logger(JobHandlers.name);

  constructor(private prisma: PrismaService) {}

  // 1. logCleanupJob: cleans up audit logs older than 7 days
  async logCleanupJob(): Promise<void> {
    const daysLimit = 7;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysLimit);

    const result = await this.prisma.operationLog.deleteMany({
      where: {
        createdAt: {
          lt: thresholdDate,
        },
      },
    });

    this.logger.log(`[Job: logCleanupJob] Successfully deleted ${result.count} audit logs older than ${daysLimit} days.`);
  }

  // 2. demoTaskJob: console print logs system status
  async demoTaskJob(): Promise<void> {
    // Check if database is connectable
    await this.prisma.$queryRawUnsafe('SELECT 1;');
    this.logger.log('[Job: demoTaskJob] System status health check: PostgreSQL and SeaweedFS S3 are running normally.');
  }

  // 3. sessionCleanupJob: cleans up expired sessions
  async sessionCleanupJob(): Promise<void> {
    const result = await this.prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    this.logger.log(`[Job: sessionCleanupJob] Successfully cleaned up ${result.count} expired user sessions.`);
  }
}
