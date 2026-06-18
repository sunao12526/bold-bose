import { DeptService } from './dept.service';
import { DeptQueryDto } from '../dto/dept-query.dto';
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
    findAll(query: DeptQueryDto): Promise<({
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
