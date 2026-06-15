import { FileService } from './file.service';
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File): Promise<any>;
    findAll(): Promise<({
        config: {
            name: string;
            storage: import("@prisma/client").$Enums.FileStorageType;
        };
    } & {
        id: number;
        configId: number;
        name: string;
        path: string;
        url: string;
        type: string | null;
        size: number;
        createdAt: Date;
    })[]>;
    remove(id: number): Promise<{
        id: number;
        configId: number;
        name: string;
        path: string;
        url: string;
        type: string | null;
        size: number;
        createdAt: Date;
    }>;
}
