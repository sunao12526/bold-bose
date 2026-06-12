import { FileConfigService } from './file-config.service';
export declare class FileConfigController {
    private fileConfigService;
    constructor(fileConfigService: FileConfigService);
    create(data: any): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
    setMaster(id: number): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        storage: import("@prisma/client").$Enums.FileStorageType;
        config: import("@prisma/client/runtime/library").JsonValue;
        master: boolean;
    }>;
}
