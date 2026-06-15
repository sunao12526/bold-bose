import { PrismaService } from '../../shared/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        username: string;
        password: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        deptId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        dept: {
            id: number;
            name: string;
        } | null;
        id: number;
        username: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        deptId: number | null;
        createdAt: Date;
        updatedAt: Date;
        roles: ({
            role: {
                id: number;
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string;
                sort: number;
            };
        } & {
            userId: number;
            roleId: number;
        })[];
        posts: ({
            post: {
                id: number;
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
                name: string;
                code: string;
                sort: number;
            };
        } & {
            userId: number;
            postId: number;
        })[];
    }[]>;
    findOne(id: number): Promise<({
        roles: {
            roleId: number;
        }[];
        posts: {
            postId: number;
        }[];
    } & {
        id: number;
        username: string;
        password: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        deptId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: number, data: any): Promise<{
        id: number;
        username: string;
        password: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        deptId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        username: string;
        password: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        deptId: number | null;
        createdAt: Date;
        updatedAt: Date;
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
    updateProfile(userId: number, data: {
        nickname: string;
        email?: string;
        mobile?: string;
    }): Promise<{
        id: number;
        username: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
    }>;
    updatePassword(userId: number, data: any): Promise<{
        success: boolean;
    }>;
}
