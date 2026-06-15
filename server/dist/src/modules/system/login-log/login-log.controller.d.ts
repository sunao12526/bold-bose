import { LoginLogService } from './login-log.service';
export declare class LoginLogController {
    private readonly service;
    constructor(service: LoginLogService);
    findAll(query: any): Promise<{
        id: number;
        status: string;
        username: string;
        ip: string;
        userAgent: string;
        loginTime: Date;
        message: string | null;
    }[]>;
}
