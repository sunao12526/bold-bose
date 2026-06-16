import { PrismaService } from './prisma/prisma.service';
interface CachedUserAuth {
    roleCodes: string[];
    permissions: string[];
    isSuperAdmin: boolean;
    expiresAt: number;
}
export declare class UserCacheService {
    private prisma;
    private readonly logger;
    private cache;
    private readonly TTL;
    constructor(prisma: PrismaService);
    getUserAuth(userId: number): Promise<CachedUserAuth>;
    invalidateUser(userId: number): void;
    invalidateAll(): void;
    private cleanup;
}
export {};
