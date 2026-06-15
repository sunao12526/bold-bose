import { PrismaService } from '../../shared/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        deptId: number | null;
    }>;
    findAll(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        roles: ({
            role: {
                id: number;
                code: string;
                name: string;
                sort: number;
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            roleId: number;
            userId: number;
        })[];
        username: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        deptId: number | null;
        dept: {
            id: number;
            name: string;
        } | null;
        posts: ({
            post: {
                id: number;
                code: string;
                name: string;
                sort: number;
                status: import("@prisma/client").$Enums.CommonStatus;
                remark: string | null;
                createdAt: Date;
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
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        password: string;
        nickname: string;
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
