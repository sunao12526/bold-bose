import { PrismaService } from '../../../shared/prisma/prisma.service';
import { SmsService } from './sms.service';
export declare class SmsCodeService {
    private prisma;
    private smsService;
    constructor(prisma: PrismaService, smsService: SmsService);
    sendCode(mobile: string, scene: number, ip: string): Promise<{
        success: boolean;
        expiredAt: Date;
    }>;
    verifyCode(mobile: string, code: string, scene: number, ip: string): Promise<{
        success: boolean;
    }>;
    findAllCodes(query?: any): Promise<{
        id: number;
        mobile: string;
        createdAt: Date;
        code: string;
        scene: number;
        todayIndex: number;
        used: boolean;
        usedIp: string | null;
        usedTime: Date | null;
        expiredAt: Date;
    }[]>;
}
