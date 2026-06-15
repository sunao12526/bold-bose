import { DictDataService } from './dict-data.service';
export declare class DictDataController {
    private dictDataService;
    constructor(dictDataService: DictDataService);
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
    findAll(dictType?: string, status?: string): Promise<{
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
