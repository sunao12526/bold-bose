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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const job_handlers_1 = require("./job.handlers");
const cron_1 = require("cron");
let JobService = class JobService {
    prisma;
    schedulerRegistry;
    jobHandlers;
    runningJobs = new Set();
    constructor(prisma, schedulerRegistry, jobHandlers) {
        this.prisma = prisma;
        this.schedulerRegistry = schedulerRegistry;
        this.jobHandlers = jobHandlers;
    }
    async onApplicationBootstrap() {
        const jobs = await this.prisma.sysJob.findMany({
            where: { status: 'ENABLE' },
        });
        for (const job of jobs) {
            await this.registerJob(job);
        }
        console.log(`[Scheduler] Loaded and registered ${jobs.length} active cron jobs.`);
    }
    async registerJob(jobRecord) {
        const jobName = `JOB_${jobRecord.id}`;
        this.unregisterJob(jobRecord.id);
        try {
            const job = new cron_1.CronJob(jobRecord.cronExpression, async () => {
                await this.runJobWrapper(jobRecord.id, jobRecord.handlerName);
            });
            this.schedulerRegistry.addCronJob(jobName, job);
            job.start();
        }
        catch (e) {
            console.error(`[Scheduler] Failed to register job "${jobRecord.name}":`, e.message);
        }
    }
    unregisterJob(jobId) {
        const jobName = `JOB_${jobId}`;
        if (this.schedulerRegistry.getCronJobs().has(jobName)) {
            try {
                const job = this.schedulerRegistry.getCronJob(jobName);
                job.stop();
                this.schedulerRegistry.deleteCronJob(jobName);
            }
            catch (e) {
                console.error(`[Scheduler] Error deleting job "${jobName}":`, e.message);
            }
        }
    }
    async runJobWrapper(jobId, handlerName) {
        const lockKey = `${jobId}_${handlerName}`;
        if (this.runningJobs.has(lockKey)) {
            console.warn(`[Scheduler] Job ${handlerName} (ID: ${jobId}) is already running, skipping execution.`);
            return;
        }
        this.runningJobs.add(lockKey);
        const startTime = Date.now();
        let status = 200;
        let errorMessage = null;
        try {
            const handler = this.jobHandlers[handlerName];
            if (typeof handler !== 'function') {
                throw new Error(`Handler name "${handlerName}" is not a valid method on JobHandlers.`);
            }
            await handler.call(this.jobHandlers);
        }
        catch (err) {
            status = 500;
            errorMessage = err.message || String(err);
            console.error(`[Scheduler] Error executing job "${handlerName}":`, err);
        }
        finally {
            const duration = Date.now() - startTime;
            this.runningJobs.delete(lockKey);
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
            }
            catch (logErr) {
                console.error('[Scheduler] Failed to write job log:', logErr);
            }
        }
    }
    async create(data) {
        try {
            new cron_1.CronJob(data.cronExpression, () => { });
        }
        catch (e) {
            throw new common_1.BadRequestException('无效的 Cron 表达式');
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
    async findOne(id) {
        const job = await this.prisma.sysJob.findUnique({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException('任务配置不存在');
        return job;
    }
    async update(id, data) {
        const existing = await this.findOne(id);
        if (data.cronExpression) {
            try {
                new cron_1.CronJob(data.cronExpression, () => { });
            }
            catch (e) {
                throw new common_1.BadRequestException('无效的 Cron 表达式');
            }
        }
        const job = await this.prisma.sysJob.update({
            where: { id },
            data,
        });
        if (job.status === 'ENABLE') {
            await this.registerJob(job);
        }
        else {
            this.unregisterJob(job.id);
        }
        return job;
    }
    async remove(id) {
        const job = await this.findOne(id);
        this.unregisterJob(job.id);
        return this.prisma.sysJob.delete({ where: { id } });
    }
    async executeOnce(id) {
        const job = await this.findOne(id);
        this.runJobWrapper(job.id, job.handlerName);
        return { success: true };
    }
    async findAllLogs() {
        return this.prisma.sysJobLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        schedule_1.SchedulerRegistry,
        job_handlers_1.JobHandlers])
], JobService);
//# sourceMappingURL=job.service.js.map