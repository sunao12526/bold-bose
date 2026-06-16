import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserCacheService } from '../../shared/user-cache.service';
export declare class RoleService {
    private prisma;
    private userCache;
    constructor(prisma: PrismaService, userCache: UserCacheService);
    create(data: any): Promise<{
        id: number;
        code: string;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query?: any): Promise<import("../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<({
        menus: {
            menuId: number;
        }[];
    } & {
        id: number;
        code: string;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: number, data: any): Promise<{
        id: number;
        code: string;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        code: string;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assignMenus(roleId: number, menuIds: number[]): Promise<{
        success: boolean;
    }>;
}
