import { PrismaService } from '../../shared/prisma/prisma.service';
export declare class RoleService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        sort: number;
    }>;
    findAll(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        sort: number;
    }[]>;
    findOne(id: number): Promise<({
        menus: {
            menuId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        sort: number;
    }) | null>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        sort: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        sort: number;
    }>;
    assignMenus(roleId: number, menuIds: number[]): Promise<{
        success: boolean;
    }>;
}
