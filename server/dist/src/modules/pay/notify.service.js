"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotifyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let NotifyService = NotifyService_1 = class NotifyService {
    prisma;
    logger = new common_1.Logger(NotifyService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNotifyTask(type, dataId) {
        let appId;
        let payOrderId = null;
        let refundId = null;
        if (type === client_1.PayNotifyType.ORDER) {
            const order = await this.prisma.payOrder.findUnique({
                where: { id: dataId },
            });
            if (!order)
                return;
            appId = order.appId;
            payOrderId = order.id;
        }
        else {
            const refund = await this.prisma.payRefund.findUnique({
                where: { id: dataId },
            });
            if (!refund)
                return;
            appId = refund.appId;
            refundId = refund.id;
        }
        const log = await this.prisma.payNotifyLog.create({
            data: {
                appId,
                payOrderId,
                refundId,
                type,
                status: client_1.PayNotifyStatus.NO,
                attemptCount: 0,
            },
        });
        this.sendNotification(log.id).catch((err) => {
            this.logger.error(`Immediate notify failed for log ${log.id}: ${err.message}`);
        });
        return log;
    }
    async sendNotification(logId) {
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
        if (!log)
            return;
        let targetUrl = '';
        let payload = {};
        if (log.type === client_1.PayNotifyType.ORDER && log.payOrder) {
            targetUrl = log.payOrder.merchantNotifyUrl;
            payload = {
                merchantOrderId: log.payOrder.merchantOrderId,
                payOrderId: log.payOrder.id,
                status: log.payOrder.status,
                payTime: log.payOrder.payTime,
            };
        }
        else if (log.type === client_1.PayNotifyType.REFUND && log.refund) {
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
        let notifyStatus = client_1.PayNotifyStatus.FAIL;
        let responseText = '';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
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
            if (response.ok &&
                (responseText.trim().toLowerCase() === 'success' ||
                    responseText.trim().toLowerCase() === 'ok' ||
                    response.status === 200 ||
                    response.status === 201)) {
                notifyStatus = client_1.PayNotifyStatus.SUCCESS;
            }
            else {
                notifyStatus = client_1.PayNotifyStatus.FAIL;
            }
        }
        catch (err) {
            clearTimeout(timeoutId);
            responseText = err.message || String(err);
            notifyStatus = client_1.PayNotifyStatus.FAIL;
        }
        let nextNotifyTime = null;
        if (notifyStatus === client_1.PayNotifyStatus.FAIL && nextAttemptCount < 5) {
            const delayMs = 10 * 1000 * Math.pow(2, nextAttemptCount - 1);
            nextNotifyTime = new Date(Date.now() + delayMs);
        }
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
        if (log.type === client_1.PayNotifyType.ORDER && log.payOrderId) {
            await this.prisma.payOrder.update({
                where: { id: log.payOrderId },
                data: { notifyStatus },
            });
        }
        else if (log.type === client_1.PayNotifyType.REFUND && log.refundId) {
            await this.prisma.payRefund.update({
                where: { id: log.refundId },
                data: { notifyStatus },
            });
        }
        this.logger.log(`Notification log ${logId} updated to ${notifyStatus}. Response: ${responseText.substring(0, 100)}`);
    }
};
exports.NotifyService = NotifyService;
exports.NotifyService = NotifyService = NotifyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotifyService);
//# sourceMappingURL=notify.service.js.map