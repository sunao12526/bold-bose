import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class UserSessionService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        username?: string;
        ip?: string;
    }): Promise<{
        id: string;
        username: string;
        nickname: string;
        userId: number;
        browser: string | null;
        os: string | null;
        token: string;
        ip: string;
        userAgent: string | null;
        loginTime: Date;
        lastActiveTime: Date;
        expiresAt: Date;
    }[]>;
    kickout(id: string): Promise<{
        id: string;
        username: string;
        nickname: string;
        userId: number;
        browser: string | null;
        os: string | null;
        token: string;
        ip: string;
        userAgent: string | null;
        loginTime: Date;
        lastActiveTime: Date;
        expiresAt: Date;
    }>;
}
