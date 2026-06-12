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
}
