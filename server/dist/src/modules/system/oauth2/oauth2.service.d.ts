import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class OAuth2Service {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClient(data: any): Promise<{
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
    findAllClients(query?: any): Promise<{
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
    findOneClient(id: number): Promise<{
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
    updateClient(id: number, data: any): Promise<{
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
    removeClient(id: number): Promise<{
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
    private codes;
    generateCode(userId: number, clientId: string, scopes: string[]): Promise<string>;
    verifyCode(code: string, clientId: string): Promise<{
        userId: number;
        scopes: string[];
    }>;
}
