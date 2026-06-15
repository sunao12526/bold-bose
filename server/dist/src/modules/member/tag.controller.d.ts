import { TagService } from './tag.service';
export declare class TagController {
    private tagService;
    constructor(tagService: TagService);
    findAll(): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    create(data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
}
