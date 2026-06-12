import { PropertyService } from './property.service';
export declare class PropertyController {
    private propertyService;
    constructor(propertyService: PropertyService);
    create(data: any): Promise<{
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, data: any): Promise<{
        values: {
            id: number;
            remark: string | null;
            createdAt: Date;
            updatedAt: Date;
            value: string;
            propertyId: number;
        }[];
    } & {
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
