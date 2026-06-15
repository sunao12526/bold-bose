import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class CodegenService {
    private prisma;
    constructor(prisma: PrismaService);
    getDbTables(): Promise<any[]>;
    importTables(tableNames: string[], author?: string): Promise<void>;
    private mapPostgresType;
    private getDefaultHtmlType;
    findAllTables(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
        author: string;
    }[]>;
    findOneTable(id: number): Promise<{
        columns: {
            dictType: string | null;
            id: number;
            tableId: number;
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
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
        author: string;
    }>;
    updateTableMetadata(id: number, data: any): Promise<{
        columns: {
            dictType: string | null;
            id: number;
            tableId: number;
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
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
        author: string;
    }>;
    removeTable(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
        author: string;
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
