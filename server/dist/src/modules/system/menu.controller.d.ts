import { MenuService } from './menu.service';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    create(data: any): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        path: string | null;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        path: string | null;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        path: string | null;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    } | null>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        path: string | null;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        permission: string | null;
        type: import("@prisma/client").$Enums.MenuType;
        path: string | null;
        icon: string | null;
        component: string | null;
        parentId: number | null;
    }>;
}
