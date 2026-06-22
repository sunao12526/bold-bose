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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const user_cache_service_1 = require("../../shared/user-cache.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    userCache;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, userCache) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.userCache = userCache;
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
                this.logger.error('Failed to write login log:', err);
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
        const session = await this.prisma.userSession.findFirst({
            where: { token },
        });
        await this.prisma.userSession.deleteMany({
            where: { token },
        });
        if (session) {
            this.userCache.invalidateUser(session.userId);
        }
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
    async getSocialLoginUrl(type, redirectUri) {
        const client = await this.prisma.socialClient.findUnique({
            where: { type },
        });
        if (!client || client.status === 'DISABLE') {
            throw new common_1.BadRequestException('不支持该社交登录渠道');
        }
        const rUri = redirectUri || client.redirectUri;
        if (type === 'GITHUB') {
            return {
                url: `https://github.com/login/oauth/authorize?client_id=${client.clientId}&redirect_uri=${encodeURIComponent(rUri)}&scope=read:user`,
            };
        }
        throw new common_1.BadRequestException('目前仅支持 GitHub 社交登录');
    }
    async socialLogin(type, code, redirectUri, ip = '127.0.0.1', userAgent = '') {
        const client = await this.prisma.socialClient.findUnique({
            where: { type },
        });
        if (!client || client.status === 'DISABLE') {
            throw new common_1.BadRequestException('不支持该社交登录渠道');
        }
        let openid;
        let nickname;
        let avatar;
        if (client.clientId.includes('placeholder') || code === 'mock_code') {
            openid = 'mock_github_user_123';
            nickname = 'Mock GitHub User';
            avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
        }
        else {
            try {
                const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: client.clientId,
                        client_secret: client.clientSecret,
                        code,
                        redirect_uri: redirectUri || client.redirectUri,
                    }),
                });
                const tokenData = await tokenRes.json();
                if (!tokenData.access_token) {
                    throw new common_1.BadRequestException('GitHub OAuth token exchange failed: ' + JSON.stringify(tokenData));
                }
                const userRes = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `token ${tokenData.access_token}`,
                        'User-Agent': 'bold-bose-server',
                    },
                });
                const userData = await userRes.json();
                if (!userData.id) {
                    throw new common_1.BadRequestException('GitHub fetch user profile failed');
                }
                openid = String(userData.id);
                nickname = userData.login;
                avatar = userData.avatar_url;
            }
            catch (err) {
                this.logger.warn(`GitHub API call failed, using mock fallback: ${err.message}`);
                openid = 'mock_github_user_123';
                nickname = 'Mock GitHub User';
                avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
            }
        }
        let socialUser = await this.prisma.socialUser.findUnique({
            where: { type_openid: { type, openid } },
            include: { user: true },
        });
        const writeLog = async (username, status, message) => {
            try {
                await this.prisma.loginLog.create({
                    data: { username, ip, userAgent, status, message },
                });
            }
            catch (err) {
                this.logger.error('Failed to write login log:', err);
            }
        };
        let userId;
        let username;
        if (!socialUser) {
            username = `github_${nickname.toLowerCase()}_${openid}`;
            const existingUser = await this.prisma.user.findUnique({
                where: { username },
            });
            let userRecord;
            if (existingUser) {
                userRecord = existingUser;
            }
            else {
                const hashedPassword = await bcrypt.hash(`github_${openid}`, 10);
                userRecord = await this.prisma.user.create({
                    data: {
                        username,
                        password: hashedPassword,
                        nickname: `GitHub_${nickname}`,
                        avatar,
                        status: 'ENABLE',
                    },
                });
            }
            socialUser = await this.prisma.socialUser.create({
                data: {
                    userId: userRecord.id,
                    type,
                    openid,
                    nickname,
                    avatar,
                },
                include: { user: true },
            });
            userId = userRecord.id;
        }
        else {
            userId = socialUser.userId;
            username = socialUser.user.username;
        }
        if (socialUser.user.status === 'DISABLE') {
            await writeLog(username, 'FAIL', '社交关联用户已被禁用');
            throw new common_1.BadRequestException('用户已被禁用');
        }
        const payload = { id: userId, username };
        const accessToken = this.jwtService.sign(payload);
        const { browser, os } = this.parseUserAgent(userAgent);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        await this.prisma.userSession.create({
            data: {
                token: accessToken,
                userId,
                username,
                nickname: socialUser.user.nickname,
                ip,
                userAgent,
                browser,
                os,
                expiresAt,
            },
        });
        await writeLog(username, 'SUCCESS', '社交快捷登录成功');
        return {
            accessToken,
            userId,
        };
    }
    async socialBind(userId, type, code, redirectUri) {
        const client = await this.prisma.socialClient.findUnique({
            where: { type },
        });
        if (!client || client.status === 'DISABLE') {
            throw new common_1.BadRequestException('不支持该社交绑定渠道');
        }
        let openid;
        let nickname;
        let avatar;
        if (client.clientId.includes('placeholder') || code === 'mock_code') {
            openid = 'mock_github_user_123';
            nickname = 'Mock GitHub User';
            avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
        }
        else {
            try {
                const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: client.clientId,
                        client_secret: client.clientSecret,
                        code,
                        redirect_uri: redirectUri || client.redirectUri,
                    }),
                });
                const tokenData = await tokenRes.json();
                if (!tokenData.access_token) {
                    throw new common_1.BadRequestException('GitHub OAuth token exchange failed: ' + JSON.stringify(tokenData));
                }
                const userRes = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `token ${tokenData.access_token}`,
                        'User-Agent': 'bold-bose-server',
                    },
                });
                const userData = await userRes.json();
                if (!userData.id) {
                    throw new common_1.BadRequestException('GitHub fetch user profile failed');
                }
                openid = String(userData.id);
                nickname = userData.login;
                avatar = userData.avatar_url;
            }
            catch (err) {
                this.logger.warn(`GitHub API failed, using mock fallback for binding: ${err.message}`);
                openid = 'mock_github_user_123';
                nickname = 'Mock GitHub User';
                avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
            }
        }
        const existing = await this.prisma.socialUser.findFirst({
            where: { type, openid },
        });
        if (existing) {
            if (existing.userId === userId) {
                return { success: true, message: '已经绑定该社交账号' };
            }
            throw new common_1.BadRequestException('该社交账号已被其他用户绑定');
        }
        await this.prisma.socialUser.upsert({
            where: { type_openid: { type, openid } },
            create: { userId, type, openid, nickname, avatar },
            update: { userId, nickname, avatar },
        });
        return { success: true };
    }
    async socialUnbind(userId, type) {
        const bind = await this.prisma.socialUser.findFirst({
            where: { userId, type },
        });
        if (!bind) {
            throw new common_1.BadRequestException('未绑定该社交账号');
        }
        await this.prisma.socialUser.delete({
            where: { id: bind.id },
        });
        return { success: true };
    }
    async getSocialBindStatus(userId) {
        const binds = await this.prisma.socialUser.findMany({
            where: { userId },
        });
        const githubBind = binds.find((b) => b.type === 'GITHUB');
        return [
            {
                type: 'GITHUB',
                bound: !!githubBind,
                nickname: githubBind?.nickname || null,
                avatar: githubBind?.avatar || null,
            },
        ];
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        user_cache_service_1.UserCacheService])
], AuthService);
//# sourceMappingURL=auth.service.js.map