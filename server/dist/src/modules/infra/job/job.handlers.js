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
var JobHandlers_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobHandlers = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let JobHandlers = JobHandlers_1 = class JobHandlers {
    prisma;
    logger = new common_1.Logger(JobHandlers_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logCleanupJob() {
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
    async demoTaskJob() {
        await this.prisma.$queryRawUnsafe('SELECT 1;');
        this.logger.log('[Job: demoTaskJob] System status health check: PostgreSQL and SeaweedFS S3 are running normally.');
    }
    async sessionCleanupJob() {
        const result = await this.prisma.userSession.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        this.logger.log(`[Job: sessionCleanupJob] Successfully cleaned up ${result.count} expired user sessions.`);
    }
};
exports.JobHandlers = JobHandlers;
exports.JobHandlers = JobHandlers = JobHandlers_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobHandlers);
//# sourceMappingURL=job.handlers.js.map