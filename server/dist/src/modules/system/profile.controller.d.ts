import { UserService } from './user.service';
import { FileService } from '../infra/file/file.service';
export declare class ProfileController {
    private userService;
    private fileService;
    constructor(userService: UserService, fileService: FileService);
    getProfile(req: any): Promise<{
        user: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            username: string;
            nickname: string;
            avatar: string | null;
            email: string | null;
            mobile: string | null;
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
        avatar: string | null;
        email: string | null;
        mobile: string | null;
    }>;
    updatePassword(req: any, data: any): Promise<{
        success: boolean;
    }>;
    uploadAvatar(file: Express.Multer.File, req: any): Promise<{
        url: any;
    }>;
}
