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
exports.FileConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const local_file_client_1 = require("./client/local-file-client");
const s3_file_client_1 = require("./client/s3-file-client");
let FileConfigService = class FileConfigService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const config = await this.prisma.fileConfig.create({ data });
        if (data.master) {
            await this.setMaster(config.id);
        }
        return config;
    }
    async findAll() {
        return this.prisma.fileConfig.findMany({
            orderBy: { id: 'asc' },
        });
    }
    async findOne(id) {
        const config = await this.prisma.fileConfig.findUnique({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('文件配置不存在');
        return config;
    }
    async update(id, data) {
        const config = await this.prisma.fileConfig.update({
            where: { id },
            data,
        });
        if (data.master) {
            await this.setMaster(id);
        }
        return config;
    }
    async remove(id) {
        const config = await this.findOne(id);
        if (config.master) {
            throw new Error('默认主配置无法删除');
        }
        return this.prisma.fileConfig.delete({ where: { id } });
    }
    async setMaster(id) {
        await this.prisma.fileConfig.updateMany({
            where: { id: { not: id } },
            data: { master: false },
        });
        return this.prisma.fileConfig.update({
            where: { id },
            data: { master: true },
        });
    }
    async getMasterClient() {
        const config = await this.prisma.fileConfig.findFirst({
            where: { master: true },
        });
        if (!config) {
            throw new Error('未找到主文件配置');
        }
        const c = config.config;
        if (config.storage === 'LOCAL') {
            return {
                client: new local_file_client_1.LocalFileClient({
                    baseFolder: c.baseFolder,
                    domain: c.domain,
                }),
                configId: config.id,
            };
        }
        else if (config.storage === 'S3') {
            return {
                client: new s3_file_client_1.S3FileClient({
                    endpoint: c.endpoint,
                    bucket: c.bucket,
                    accessKey: c.accessKey,
                    secretKey: c.secretKey,
                    domain: c.domain,
                }),
                configId: config.id,
            };
        }
        throw new Error('不支持的存储类型');
    }
};
exports.FileConfigService = FileConfigService;
exports.FileConfigService = FileConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FileConfigService);
//# sourceMappingURL=file-config.service.js.map