import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PayNotifyType, PayNotifyStatus } from '@prisma/client';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  constructor(private prisma: PrismaService) {}

  // 1. Create a notification task for pay order or refund success
  async createNotifyTask(type: PayNotifyType, dataId: number) {
    let appId: number;
    let payOrderId: number | null = null;
    let refundId: number | null = null;

    if (type === PayNotifyType.ORDER) {
      const order = await this.prisma.payOrder.findUnique({ where: { id: dataId } });
      if (!order) return;
      appId = order.appId;
      payOrderId = order.id;
    } else {
      const refund = await this.prisma.payRefund.findUnique({ where: { id: dataId } });
      if (!refund) return;
      appId = refund.appId;
      refundId = refund.id;
    }

    const log = await this.prisma.payNotifyLog.create({
      data: {
        appId,
        payOrderId,
        refundId,
        type,
        status: PayNotifyStatus.NO,
        attemptCount: 0,
      },
    });

    // Execute immediately in background
    this.sendNotification(log.id).catch((err) => {
      this.logger.error(`Immediate notify failed for log ${log.id}: ${err.message}`);
    });

    return log;
  }

  // 2. Perform HTTP request to the merchant's callback URL
  async sendNotification(logId: number) {
    const log = await this.prisma.payNotifyLog.findUnique({
      where: { id: logId },
      include: {
        payOrder: true,
        refund: {
          include: {
            payOrder: true,
          },
        },
      },
    });

    if (!log) return;

    let targetUrl = '';
    let payload: any = {};

    if (log.type === PayNotifyType.ORDER && log.payOrder) {
      targetUrl = log.payOrder.merchantNotifyUrl;
      payload = {
        merchantOrderId: log.payOrder.merchantOrderId,
        payOrderId: log.payOrder.id,
        status: log.payOrder.status,
        payTime: log.payOrder.payTime,
      };
    } else if (log.type === PayNotifyType.REFUND && log.refund) {
      targetUrl = log.refund.merchantNotifyUrl;
      payload = {
        merchantOrderId: log.refund.payOrder.merchantOrderId,
        merchantRefundId: log.refund.merchantRefundId,
        refundId: log.refund.id,
        status: log.refund.status,
        refundTime: log.refund.refundTime,
      };
    }

    if (!targetUrl) {
      this.logger.warn(`No target URL for notification log ${logId}`);
      return;
    }

    const nextAttemptCount = log.attemptCount + 1;
    let notifyStatus: PayNotifyStatus = PayNotifyStatus.FAIL;
    let responseText = '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    try {
      this.logger.log(`Sending notification to ${targetUrl} (Attempt #${nextAttemptCount})...`);
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      responseText = await response.text();

      if (response.ok && (responseText.trim().toLowerCase() === 'success' || responseText.trim().toLowerCase() === 'ok' || response.status === 200 || response.status === 201)) {
        notifyStatus = PayNotifyStatus.SUCCESS;
      } else {
        notifyStatus = PayNotifyStatus.FAIL;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      responseText = err.message || String(err);
      notifyStatus = PayNotifyStatus.FAIL;
    }

    // Calculate next retry time with backoff
    let nextNotifyTime: Date | null = null;
    if (notifyStatus === PayNotifyStatus.FAIL && nextAttemptCount < 5) {
      // 10s, 20s, 40s, 80s
      const delayMs = 10 * 1000 * Math.pow(2, nextAttemptCount - 1);
      nextNotifyTime = new Date(Date.now() + delayMs);
    }

    // Update log
    await this.prisma.payNotifyLog.update({
      where: { id: logId },
      data: {
        status: notifyStatus,
        attemptCount: nextAttemptCount,
        lastAttemptTime: new Date(),
        nextNotifyTime,
        responseContent: responseText.substring(0, 2000),
      },
    });

    // Update order or refund overall notify status
    if (log.type === PayNotifyType.ORDER && log.payOrderId) {
      await this.prisma.payOrder.update({
        where: { id: log.payOrderId },
        data: { notifyStatus },
      });
    } else if (log.type === PayNotifyType.REFUND && log.refundId) {
      await this.prisma.payRefund.update({
        where: { id: log.refundId },
        data: { notifyStatus },
      });
    }

    this.logger.log(`Notification log ${logId} updated to ${notifyStatus}. Response: ${responseText.substring(0, 100)}`);
  }
}
