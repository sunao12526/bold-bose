import { PrismaService } from '../../../shared/prisma/prisma.service';
import { FileConfigService } from './file-config.service';
export declare class FileService {
    private prisma;
    private fileConfigService;
    constructor(prisma: PrismaService, fileConfigService: FileConfigService);
    upload(file: Express.Multer.File): Promise<any>;
    findAll(): Promise<({
        config: {
            name: string;
            storage: import("@prisma/client").$Enums.FileStorageType;
        };
    } & {
        path: string;
        id: number;
        name: string;
        createdAt: Date;
        type: string | null;
        url: string;
        configId: number;
        size: number;
    })[]>;
    findOne(id: number): Promise<{
        path: string;
        id: number;
        name: string;
        createdAt: Date;
        type: string | null;
        url: string;
        configId: number;
        size: number;
    }>;
    remove(id: number): Promise<{
        path: string;
        id: number;
        name: string;
        createdAt: Date;
        type: string | null;
        url: string;
        configId: number;
        size: number;
    }>;
}
