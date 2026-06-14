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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    parseUserAgent(userAgentStr) {
        let browser = 'Unknown Browser';
        let os = 'Unknown OS';
        if (!userAgentStr)
            return { browser, os };
        const ua = userAgentStr.toLowerCase();
        if (ua.includes('chrome'))
            browser = 'Chrome';
        else if (ua.includes('firefox'))
            browser = 'Firefox';
        else if (ua.includes('safari'))
            browser = 'Safari';
        else if (ua.includes('edge'))
            browser = 'Edge';
        else if (ua.includes('opera') || ua.includes('opr'))
            browser = 'Opera';
        if (ua.includes('windows'))
            os = 'Windows';
        else if (ua.includes('macintosh') || ua.includes('mac os'))
            os = 'macOS';
        else if (ua.includes('linux'))
            os = 'Linux';
        else if (ua.includes('iphone') || ua.includes('ipad'))
            os = 'iOS';
        else if (ua.includes('android'))
            os = 'Android';
        return { browser, os };
    }
    async login(loginDto, ip = '127.0.0.1', userAgent = '') {
        const writeLog = async (status, message) => {
            try {
                await this.prisma.loginLog.create({
                    data: {
                        username: loginDto.username,
                        ip,
                        userAgent,
                        status,
                        message,
                    },
                });
            }
            catch (err) {
                console.error('Failed to write login log:', err);
            }
        };
        const user = await this.prisma.user.findUnique({
            where: { username: loginDto.username },
        });
        if (!user) {
            await writeLog('FAIL', '用户名不存在');
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        if (user.status === 'DISABLE') {
            await writeLog('FAIL', '用户已被禁用');
            throw new common_1.UnauthorizedException('用户已被禁用');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            await writeLog('FAIL', '密码错误');
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const payload = { id: user.id, username: user.username };
        const accessToken = this.jwtService.sign(payload);
        const { browser, os } = this.parseUserAgent(userAgent);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        await this.prisma.userSession.create({
            data: {
                token: accessToken,
                userId: user.id,
                username: user.username,
                nickname: user.nickname,
                ip,
                userAgent,
                browser,
                os,
                expiresAt,
            },
        });
        await writeLog('SUCCESS', '登录成功');
        return {
            accessToken,
            userId: user.id,
        };
    }
    async logout(token) {
        await this.prisma.userSession.deleteMany({
            where: { token },
        });
    }
    async getUserPermissionInfo(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                nickname: true,
                email: true,
                mobile: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            include: { role: true },
        });
        const roles = userRoles.map((ur) => ur.role.code);
        let permissions = [];
        if (roles.includes('super_admin')) {
            permissions = ['*:*:*'];
        }
        else {
            const roleIds = userRoles.map((ur) => ur.roleId);
            if (roleIds.length > 0) {
                const roleMenus = await this.prisma.roleMenu.findMany({
                    where: { roleId: { in: roleIds } },
                    include: { menu: true },
                });
                permissions = roleMenus
                    .map((rm) => rm.menu.permission)
                    .filter((p) => !!p);
            }
        }
        return {
            user,
            roles,
            permissions,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map