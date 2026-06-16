import { MenuService } from './menu.service';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    create(data: any): Promise<{
        path: string | null;
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }>;
    findAll(): Promise<{
        path: string | null;
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }[]>;
    findOne(id: number): Promise<{
        path: string | null;
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    } | null>;
    update(id: number, data: any): Promise<{
        path: string | null;
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }>;
    remove(id: number): Promise<{
        path: string | null;
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }>;
}
