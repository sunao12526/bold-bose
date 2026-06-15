import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class OAuth2Service {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClient(data: any): Promise<{
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
    findAllClients(query?: any): Promise<{
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
    findOneClient(id: number): Promise<{
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
    updateClient(id: number, data: any): Promise<{
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
    removeClient(id: number): Promise<{
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
    private codes;
    generateCode(userId: number, clientId: string, scopes: string[]): Promise<string>;
    verifyCode(code: string, clientId: string): Promise<{
        userId: number;
        scopes: string[];
    }>;
}
