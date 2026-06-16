import { PrismaService } from '../../shared/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        deptId: number | null;
    }>;
    findAll(): Promise<{
        username: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        roles: ({
            role: {
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                name: string;
                sort: number;
                code: string;
            };
        } & {
            userId: number;
            roleId: number;
        })[];
        dept: {
            id: number;
            name: string;
        } | null;
        posts: ({
            post: {
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
                id: number;
                name: string;
                sort: number;
                code: string;
            };
        } & {
            userId: number;
            postId: number;
        })[];
        id: number;
        deptId: number | null;
    }[]>;
    findOne(id: number): Promise<({
        roles: {
            roleId: number;
        }[];
        posts: {
            postId: number;
        }[];
    } & {
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        deptId: number | null;
    }) | null>;
    update(id: number, data: any): Promise<{
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        deptId: number | null;
    }>;
    remove(id: number): Promise<{
        username: string;
        password: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
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
            username: string;
            nickname: string;
            avatar: string | null;
            email: string | null;
            mobile: string | null;
            status: import("@prisma/client").$Enums.CommonStatus;
            remark: string | null;
            createdAt: Date;
            id: number;
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
        username: string;
        nickname: string;
        avatar: string | null;
        email: string | null;
        mobile: string | null;
        id: number;
    }>;
    updatePassword(userId: number, data: any): Promise<{
        success: boolean;
    }>;
}
