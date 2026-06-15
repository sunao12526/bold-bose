import { UserService } from './user.service';
export declare class ProfileController {
    private userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<{
        user: {
            id: number;
            username: string;
            nickname: string;
            email: string | null;
            mobile: string | null;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
        };
        roles: {
            id: number;
            name: string;
            code: string;
        }[];
    }>;
    updateProfile(req: any, data: any): Promise<{
        id: number;
        username: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
    }>;
    updatePassword(req: any, data: any): Promise<{
        success: boolean;
    }>;
}
