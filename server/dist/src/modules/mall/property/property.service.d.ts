import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class PropertyService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        remark?: string;
        values?: string[];
    }): Promise<{
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, data: {
        name?: string;
        remark?: string;
        values?: {
            id?: number;
            value: string;
        }[];
    }): Promise<{
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
