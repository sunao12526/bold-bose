import { MenuService } from './menu.service';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        type: import("@prisma/client").$Enums.MenuType;
        permission: string | null;
        parentId: number | null;
        path: string | null;
        icon: string | null;
        component: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        type: import("@prisma/client").$Enums.MenuType;
        permission: string | null;
        parentId: number | null;
        path: string | null;
        icon: string | null;
        component: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        type: import("@prisma/client").$Enums.MenuType;
        permission: string | null;
        parentId: number | null;
        path: string | null;
        icon: string | null;
        component: string | null;
    } | null>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        type: import("@prisma/client").$Enums.MenuType;
        permission: string | null;
        parentId: number | null;
        path: string | null;
        icon: string | null;
        component: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        type: import("@prisma/client").$Enums.MenuType;
        permission: string | null;
        parentId: number | null;
        path: string | null;
        icon: string | null;
        component: string | null;
    }>;
}
