import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class DictDataService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        dictType: string;
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        sort: number;
        label: string;
        value: string;
        colorType: string | null;
    }>;
    findAll(query?: {
        dictType?: string;
        status?: string;
    }): Promise<{
        dictType: string;
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        sort: number;
        label: string;
        value: string;
        colorType: string | null;
    }[]>;
    findOne(id: number): Promise<{
        dictType: string;
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        sort: number;
        label: string;
        value: string;
        colorType: string | null;
    }>;
    update(id: number, data: any): Promise<{
        dictType: string;
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        sort: number;
        label: string;
        value: string;
        colorType: string | null;
    }>;
    remove(id: number): Promise<{
        dictType: string;
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        sort: number;
        label: string;
        value: string;
        colorType: string | null;
    }>;
}
