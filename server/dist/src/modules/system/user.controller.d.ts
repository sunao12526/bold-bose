import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
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
    assignRoles(id: number, roleIds: number[]): Promise<{
        success: boolean;
    }>;
}
