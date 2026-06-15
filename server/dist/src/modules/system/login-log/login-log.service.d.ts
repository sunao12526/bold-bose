import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class LoginLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        username: string;
        ip: string;
        userAgent: string;
        status: string;
        message?: string;
    }): Promise<{
        id: number;
        status: string;
        username: string;
        message: string | null;
        ip: string;
        userAgent: string;
        loginTime: Date;
    }>;
    findAll(query?: any): Promise<{
        id: number;
        status: string;
        username: string;
        message: string | null;
        ip: string;
        userAgent: string;
        loginTime: Date;
    }[]>;
}
