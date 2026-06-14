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
exports.OAuth2Service = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let OAuth2Service = class OAuth2Service {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createClient(data) {
        return this.prisma.oAuth2Client.create({
            data: {
                clientId: data.clientId,
                secret: data.secret,
                name: data.name,
                logo: data.logo || null,
                redirectUris: typeof data.redirectUris === 'string' ? data.redirectUris : JSON.stringify(data.redirectUris || []),
                scopes: typeof data.scopes === 'string' ? data.scopes : JSON.stringify(data.scopes || []),
                status: data.status || 'ENABLE',
            },
        });
    }
    async findAllClients(query) {
        const where = {};
        if (query?.clientId) {
            where.clientId = { contains: query.clientId };
        }
        if (query?.name) {
            where.name = { contains: query.name };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.oAuth2Client.findMany({
            where,
            orderBy: { id: 'desc' },
        });
    }
    async findOneClient(id) {
        const record = await this.prisma.oAuth2Client.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('OAuth2 客户端不存在');
        return record;
    }
    async updateClient(id, data) {
        await this.findOneClient(id);
        return this.prisma.oAuth2Client.update({
            where: { id },
            data: {
                clientId: data.clientId,
                secret: data.secret,
                name: data.name,
                logo: data.logo,
                redirectUris: data.redirectUris !== undefined ? (typeof data.redirectUris === 'string' ? data.redirectUris : JSON.stringify(data.redirectUris)) : undefined,
                scopes: data.scopes !== undefined ? (typeof data.scopes === 'string' ? data.scopes : JSON.stringify(data.scopes)) : undefined,
                status: data.status,
            },
        });
    }
    async removeClient(id) {
        await this.findOneClient(id);
        return this.prisma.oAuth2Client.delete({ where: { id } });
    }
};
exports.OAuth2Service = OAuth2Service;
exports.OAuth2Service = OAuth2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OAuth2Service);
//# sourceMappingURL=oauth2.service.js.map