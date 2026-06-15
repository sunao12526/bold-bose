import { LoginLogService } from './login-log.service';
export declare class LoginLogController {
    private readonly service;
    constructor(service: LoginLogService);
    findAll(query: any): Promise<{
        id: number;
        username: string;
        status: string;
        message: string | null;
        ip: string;
        userAgent: string;
        loginTime: Date;
    }[]>;
}
