import { DeptService } from './dept.service';
export declare class DeptController {
    private readonly service;
    constructor(service: DeptService);
    create(data: any): Promise<{
        id: number;
        email: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        parentId: number;
        leaderId: number | null;
        phone: string | null;
    }>;
    findAll(query: any): Promise<({
        leader: {
            id: number;
            username: string;
            nickname: string;
        } | null;
    } & {
        id: number;
        email: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        parentId: number;
        leaderId: number | null;
        phone: string | null;
    })[]>;
    findOne(id: number): Promise<{
        leader: {
            id: number;
            username: string;
            nickname: string;
        } | null;
    } & {
        id: number;
        email: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        parentId: number;
        leaderId: number | null;
        phone: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        email: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        parentId: number;
        leaderId: number | null;
        phone: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        email: string | null;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sort: number;
        parentId: number;
        leaderId: number | null;
        phone: string | null;
    }>;
}
