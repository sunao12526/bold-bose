import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class ConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        value: string;
        key: string;
        visible: boolean;
    }>;
    findAll(): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        value: string;
        key: string;
        visible: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        value: string;
        key: string;
        visible: boolean;
    }>;
    findByKey(key: string): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        value: string;
        key: string;
        visible: boolean;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        value: string;
        key: string;
        visible: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        value: string;
        key: string;
        visible: boolean;
    }>;
}
