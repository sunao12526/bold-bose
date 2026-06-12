import { ConfigService } from './config.service';
export declare class ConfigController {
    private configService;
    constructor(configService: ConfigService);
    create(data: any): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        visible: boolean;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        visible: boolean;
    }[]>;
    findByKey(key: string): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        visible: boolean;
    }>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        visible: boolean;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        visible: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        key: string;
        visible: boolean;
    }>;
}
