import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
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
    assignRoles(id: number, roleIds: number[]): Promise<{
        success: boolean;
    }>;
}
