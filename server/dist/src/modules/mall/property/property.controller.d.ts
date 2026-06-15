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
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        remark: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
}
