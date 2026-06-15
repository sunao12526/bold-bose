import { RoleService } from './role.service';
export declare class RoleController {
    private roleService;
    constructor(roleService: RoleService);
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
    findAll(): Promise<{
        id: number;
        code: string;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
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
    assignMenus(id: number, menuIds: number[]): Promise<{
        success: boolean;
    }>;
}
