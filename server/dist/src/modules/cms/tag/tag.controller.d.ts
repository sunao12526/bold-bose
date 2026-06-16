import { TagService } from './tag.service';
export declare class TagController {
    private tagService;
    constructor(tagService: TagService);
    create(data: any): Promise<{
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(query: any): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: number, data: any): Promise<{
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
