"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const file_config_service_1 = require("./file-config.service");
const local_file_client_1 = require("./client/local-file-client");
const s3_file_client_1 = require("./client/s3-file-client");
const crypto = __importStar(require("crypto"));
const path = __importStar(require("path"));
let FileService = FileService_1 = class FileService {
    prisma;
    fileConfigService;
    logger = new common_1.Logger(FileService_1.name);
    constructor(prisma, fileConfigService) {
        this.prisma = prisma;
        this.fileConfigService = fileConfigService;
    }
    async upload(file) {
        const { client, configId } = await this.fileConfigService.getMasterClient();
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const uuid = crypto.randomUUID();
        const ext = path.extname(file.originalname);
        const filePath = `${year}/${month}/${day}/${uuid}${ext}`;
        const fileUrl = await client.upload(file.buffer, filePath, file.mimetype);
        const fileRecord = await this.prisma.file.create({
            data: {
                configId,
                name: file.originalname,
                path: filePath,
                url: fileUrl,
                type: file.mimetype,
                size: file.size,
            },
        });
        return fileRecord;
    }
    async findAll() {
        return this.prisma.file.findMany({
            orderBy: { createdAt: 'desc' },
            include: { config: { select: { name: true, storage: true } } },
        });
    }
    async findOne(id) {
        const file = await this.prisma.file.findUnique({ where: { id } });
        if (!file)
            throw new common_1.NotFoundException('文件记录不存在');
        return file;
    }
    async remove(id) {
        const file = await this.findOne(id);
        const config = await this.prisma.fileConfig.findUnique({
            where: { id: file.configId },
        });
        if (config) {
            const c = config.config;
            const client = config.storage === 'LOCAL'
                ? new local_file_client_1.LocalFileClient({ baseFolder: c.baseFolder, domain: c.domain })
                : new s3_file_client_1.S3FileClient({
                    endpoint: c.endpoint,
                    bucket: c.bucket,
                    accessKey: c.accessKey,
                    secretKey: c.secretKey,
                    domain: c.domain,
                });
            try {
                await client.delete(file.path);
            }
            catch (err) {
                this.logger.error('Failed to delete file from storage provider:', err);
            }
        }
        return this.prisma.file.delete({ where: { id } });
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_config_service_1.FileConfigService])
], FileService);
//# sourceMappingURL=file.service.js.map