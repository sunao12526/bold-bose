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
        path: string;
        id: number;
        name: string;
        createdAt: Date;
        type: string | null;
        configId: number;
        url: string;
        size: number;
    })[]>;
    remove(id: number): Promise<{
        path: string;
        id: number;
        name: string;
        createdAt: Date;
        type: string | null;
        configId: number;
        url: string;
        size: number;
    }>;
}
