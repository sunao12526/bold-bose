import { OAuth2Service } from './oauth2.service';
export declare class OAuth2ClientController {
    private readonly service;
    constructor(service: OAuth2Service);
    create(data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        clientId: string;
        secret: string;
        redirectUris: string;
        scopes: string;
    }>;
    findAll(query: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        clientId: string;
        secret: string;
        redirectUris: string;
        scopes: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        clientId: string;
        secret: string;
        redirectUris: string;
        scopes: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        clientId: string;
        secret: string;
        redirectUris: string;
        scopes: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        clientId: string;
        secret: string;
        redirectUris: string;
        scopes: string;
    }>;
}
