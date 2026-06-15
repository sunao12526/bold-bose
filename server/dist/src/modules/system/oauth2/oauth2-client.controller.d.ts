import { OAuth2Service } from './oauth2.service';
export declare class OAuth2ClientController {
    private readonly service;
    constructor(service: OAuth2Service);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        clientId: string;
        secret: string;
        logo: string | null;
        redirectUris: string;
        scopes: string;
    }>;
    findAll(query: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        clientId: string;
        secret: string;
        logo: string | null;
        redirectUris: string;
        scopes: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        clientId: string;
        secret: string;
        logo: string | null;
        redirectUris: string;
        scopes: string;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        clientId: string;
        secret: string;
        logo: string | null;
        redirectUris: string;
        scopes: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        clientId: string;
        secret: string;
        logo: string | null;
        redirectUris: string;
        scopes: string;
    }>;
}
