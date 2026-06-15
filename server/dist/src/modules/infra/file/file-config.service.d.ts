import { PrismaService } from '../../../shared/prisma/prisma.service';
import { FileClient } from './client/file-client.interface';
export declare class FileConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    findAll(): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    setMaster(id: number): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    getMasterClient(): Promise<{
        client: FileClient;
        configId: number;
    }>;
}
