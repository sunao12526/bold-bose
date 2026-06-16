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
    findAll(query: any): Promise<import("../../shared/pagination").PaginatedResult<unknown>>;
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
