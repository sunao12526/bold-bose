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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'yudao-nestjs-secret-key-2026',
            passReqToCallback: true,
        });
        this.prisma = prisma;
    }
    async validate(req, payload) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new common_1.UnauthorizedException('未提供认证凭证');
        }
        const session = await this.prisma.userSession.findUnique({
            where: { token },
        });
        if (!session) {
            throw new common_1.UnauthorizedException('您的登录已失效或已被管理员强制下线，请重新登录');
        }
        const now = new Date();
        if (session.expiresAt < now) {
            throw new common_1.UnauthorizedException('会话已过期，请重新登录');
        }
        if (now.getTime() - session.lastActiveTime.getTime() > 60000) {
            this.prisma.userSession.update({
                where: { id: session.id },
                data: { lastActiveTime: now },
            }).catch((e) => console.error('Failed to update active time:', e));
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.id },
        });
        if (!user || user.status === 'DISABLE') {
            throw new common_1.UnauthorizedException('用户不存在或已被禁用');
        }
        return {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            sessionId: session.id
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map