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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Controller = void 0;
const common_1 = require("@nestjs/common");
const oauth2_service_1 = require("./oauth2.service");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const public_decorator_1 = require("../../../shared/decorators/public.decorator");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
let OAuth2Controller = class OAuth2Controller {
    oauth2Service;
    jwtService;
    prisma;
    constructor(oauth2Service, jwtService, prisma) {
        this.oauth2Service = oauth2Service;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async authorize(clientId, redirectUri, responseType, scopeStr, state, req, res) {
        if (responseType !== 'code') {
            throw new common_1.BadRequestException('Unsupported response_type. Must be "code".');
        }
        const clients = await this.prisma.oAuth2Client.findMany({
            where: { clientId, status: 'ENABLE' },
        });
        if (clients.length === 0) {
            throw new common_1.BadRequestException('OAuth2 client not found or disabled.');
        }
        const client = clients[0];
        const allowedUris = JSON.parse(client.redirectUris || '[]');
        if (!allowedUris.includes(redirectUri)) {
            throw new common_1.BadRequestException('Redirect URI not authorized for this client.');
        }
        const scopes = scopeStr ? scopeStr.split(' ') : [];
        const code = await this.oauth2Service.generateCode(req.user.id, clientId, scopes);
        const targetUrl = `${redirectUri}?code=${code}${state ? `&state=${state}` : ''}`;
        return res.redirect(targetUrl);
    }
    async token(grantType, code, clientId, clientSecret, redirectUri) {
        const clients = await this.prisma.oAuth2Client.findMany({
            where: { clientId, status: 'ENABLE' },
        });
        if (clients.length === 0) {
            throw new common_1.BadRequestException('OAuth2 client not found or disabled.');
        }
        const client = clients[0];
        if (client.secret !== clientSecret) {
            throw new common_1.UnauthorizedException('Client secret invalid.');
        }
        if (grantType === 'authorization_code') {
            try {
                const { userId, scopes } = await this.oauth2Service.verifyCode(code, clientId);
                const user = await this.prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user || user.status === 'DISABLE') {
                    throw new common_1.UnauthorizedException('User not found or disabled.');
                }
                const payload = { id: user.id, username: user.username, scopes };
                const accessToken = this.jwtService.sign(payload);
                const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
                return {
                    access_token: accessToken,
                    token_type: 'Bearer',
                    expires_in: 86400,
                    refresh_token: refreshToken,
                    scope: scopes.join(' '),
                };
            }
            catch (err) {
                throw new common_1.BadRequestException(err.message || 'Authorization code validation failed.');
            }
        }
        else if (grantType === 'client_credentials') {
            const payload = { clientId, scopes: JSON.parse(client.scopes || '[]') };
            const accessToken = this.jwtService.sign(payload);
            return {
                access_token: accessToken,
                token_type: 'Bearer',
                expires_in: 86400,
            };
        }
        throw new common_1.BadRequestException('Unsupported grant_type.');
    }
    async userinfo(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing or invalid Authorization header.');
        }
        const token = authHeader.replace('Bearer ', '');
        try {
            const payload = this.jwtService.verify(token);
            if (payload.clientId) {
                return { client_id: payload.clientId, scopes: payload.scopes };
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.id },
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    email: true,
                    mobile: true,
                    status: true,
                },
            });
            if (!user || user.status === 'DISABLE') {
                throw new common_1.UnauthorizedException('User not found or disabled.');
            }
            return {
                sub: `user_${user.id}`,
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                email: user.email,
                mobile: user.mobile,
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired token.');
        }
    }
};
exports.OAuth2Controller = OAuth2Controller;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('authorize'),
    __param(0, (0, common_1.Query)('client_id')),
    __param(1, (0, common_1.Query)('redirect_uri')),
    __param(2, (0, common_1.Query)('response_type')),
    __param(3, (0, common_1.Query)('scope')),
    __param(4, (0, common_1.Query)('state')),
    __param(5, (0, common_1.Req)()),
    __param(6, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "authorize", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('token'),
    __param(0, (0, common_1.Body)('grant_type')),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('client_id')),
    __param(3, (0, common_1.Body)('client_secret')),
    __param(4, (0, common_1.Body)('redirect_uri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "token", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('userinfo'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "userinfo", null);
exports.OAuth2Controller = OAuth2Controller = __decorate([
    (0, common_1.Controller)('system/oauth2'),
    __metadata("design:paramtypes", [oauth2_service_1.OAuth2Service,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], OAuth2Controller);
//# sourceMappingURL=oauth2.controller.js.map