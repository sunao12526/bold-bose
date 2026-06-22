import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class CodegenService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDbTables(): Promise<any[]>;
    importTables(tableNames: string[], author?: string): Promise<void>;
    private mapPostgresType;
    private getDefaultHtmlType;
    findAllTables(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
    }[]>;
    findOneTable(id: number): Promise<{
        columns: {
            id: number;
            dictType: string | null;
            columnName: string;
            dataType: string;
            columnComment: string;
            nullable: boolean;
            primaryKey: boolean;
            autoIncrement: boolean;
            tsType: string;
            prismaType: string;
            crud: boolean;
            listOperation: boolean;
            listOperationCondition: string;
            formOperation: boolean;
            htmlType: string;
            tableId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
    }>;
    updateTableMetadata(id: number, data: any): Promise<{
        columns: {
            id: number;
            dictType: string | null;
            columnName: string;
            dataType: string;
            columnComment: string;
            nullable: boolean;
            primaryKey: boolean;
            autoIncrement: boolean;
            tsType: string;
            prismaType: string;
            crud: boolean;
            listOperation: boolean;
            listOperationCondition: string;
            formOperation: boolean;
            htmlType: string;
            tableId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
    }>;
    removeTable(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
    }>;
    generateCodePreview(tableId: number): Promise<any[]>;
    writeCodeToDisk(tableId: number): Promise<{
        success: boolean;
        files: string[];
        parentRegistered: boolean;
    }>;
    private registerInParentModule;
    private renderController;
    private renderService;
    private renderModule;
    private renderFrontendPage;
}
