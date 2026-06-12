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
}
