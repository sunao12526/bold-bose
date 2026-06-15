import { CodegenService } from './codegen.service';
export declare class CodegenController {
    private readonly codegenService;
    constructor(codegenService: CodegenService);
    getDbTables(): Promise<any[]>;
    importTables(tableNames: string[], author?: string): Promise<{
        success: boolean;
    }>;
    findAll(): Promise<{
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
    findOne(id: number): Promise<{
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
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
        author: string;
    }>;
    update(id: number, data: any): Promise<{
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
        tableName: string;
        tableComment: string;
        className: string;
        moduleName: string;
        businessName: string;
        classComment: string;
        author: string;
    }>;
    remove(id: number): Promise<{
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
    preview(id: number): Promise<any[]>;
    writeCode(id: number): Promise<{
        success: boolean;
        files: string[];
        parentRegistered: boolean;
    }>;
}
