import { SmsCodeService } from './sms-code.service';
export declare class SmsCodeController {
    private readonly smsCodeService;
    constructor(smsCodeService: SmsCodeService);
    sendCode(mobile: string, scene: number, req: any): Promise<{
        success: boolean;
        expiredAt: Date;
    }>;
    verifyCode(mobile: string, code: string, scene: number, req: any): Promise<{
        success: boolean;
    }>;
    findAll(query: any): Promise<{
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
