import { DeptService } from './dept.service';
export declare class DeptController {
    private readonly service;
    constructor(service: DeptService);
    create(data: any): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: number;
        email: string | null;
        phone: string | null;
        leaderId: number | null;
    }>;
    findAll(query: any): Promise<({
        leader: {
            id: number;
            username: string;
            nickname: string;
        } | null;
    } & {
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: number;
        email: string | null;
        phone: string | null;
        leaderId: number | null;
    })[]>;
    findOne(id: number): Promise<{
        leader: {
            id: number;
            username: string;
            nickname: string;
        } | null;
    } & {
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: number;
        email: string | null;
        phone: string | null;
        leaderId: number | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: number;
        email: string | null;
        phone: string | null;
        leaderId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        sort: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: number;
        email: string | null;
        phone: string | null;
        leaderId: number | null;
    }>;
}
