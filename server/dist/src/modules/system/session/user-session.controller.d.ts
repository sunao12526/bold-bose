import { UserSessionService } from './user-session.service';
export declare class UserSessionController {
    private userSessionService;
    constructor(userSessionService: UserSessionService);
    findAll(username?: string, ip?: string): Promise<{
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
        success: boolean;
    }>;
}
