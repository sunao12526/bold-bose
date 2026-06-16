import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserCacheService } from '../../shared/user-cache.service';
export declare class UserService {
    private prisma;
    private userCache;
    constructor(prisma: PrismaService, userCache: UserCacheService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        deptId: number | null;
    }>;
    findAll(query?: any): Promise<import("../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<({
        roles: {
            roleId: number;
        }[];
        posts: {
            postId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        deptId: number | null;
    }) | null>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        deptId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        deptId: number | null;
    }>;
    assignRoles(userId: number, roleIds: number[]): Promise<{
        success: boolean;
    }>;
    assignPosts(userId: number, postIds: number[]): Promise<{
        success: boolean;
    }>;
    getProfile(userId: number): Promise<{
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
    updateProfile(userId: number, data: {
        nickname: string;
        email?: string;
        mobile?: string;
        avatar?: string;
    }): Promise<{
        id: number;
        username: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
    }>;
    updatePassword(userId: number, data: any): Promise<{
        success: boolean;
    }>;
}
