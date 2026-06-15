import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: any): Promise<{
        accessToken: string;
        userId: number;
    }>;
    logout(req: any): Promise<{
        success: boolean;
    }>;
    getPermissionInfo(req: any): Promise<{
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
    socialLogin(type: string, code: string, redirectUri: string, req: any): Promise<{
        accessToken: string;
        userId: number;
    }>;
    socialBind(req: any, type: string, code: string, redirectUri?: string): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    socialUnbind(req: any, type: string): Promise<{
        success: boolean;
    }>;
    getSocialBindStatus(req: any): Promise<{
        type: string;
        bound: boolean;
        nickname: string | null;
        avatar: string | null;
    }[]>;
}
