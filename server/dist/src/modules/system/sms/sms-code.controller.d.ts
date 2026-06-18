import { SmsCodeService } from './sms-code.service';
import { SmsCodeQueryDto } from '../dto/sms-code-query.dto';
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
    findAll(query: SmsCodeQueryDto): Promise<{
        id: number;
        code: string;
        createdAt: Date;
        mobile: string;
        scene: number;
        todayIndex: number;
        used: boolean;
        usedIp: string | null;
        usedTime: Date | null;
        expiredAt: Date;
    }[]>;
}
