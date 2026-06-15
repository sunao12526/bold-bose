import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private parseUserAgent;
    login(loginDto: LoginDto, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        userId: number;
    }>;
    logout(token: string): Promise<void>;
    getUserPermissionInfo(userId: number): Promise<{
        user: {
            id: number;
            username: string;
            nickname: string;
            email: string | null;
            mobile: string | null;
        };
        roles: string[];
        permissions: string[];
    }>;
    getSocialLoginUrl(type: string, redirectUri?: string): Promise<{
        url: string;
    }>;
    socialLogin(type: string, code: string, redirectUri?: string, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        userId: number;
    }>;
    socialBind(userId: number, type: string, code: string, redirectUri?: string): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    socialUnbind(userId: number, type: string): Promise<{
        success: boolean;
    }>;
    getSocialBindStatus(userId: number): Promise<{
        type: string;
        bound: boolean;
        nickname: string | null;
        avatar: string | null;
    }[]>;
}
