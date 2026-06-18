import { LoginLogService } from './login-log.service';
import { LoginLogQueryDto } from '../dto/login-log-query.dto';
export declare class LoginLogController {
    private readonly service;
    constructor(service: LoginLogService);
    findAll(query: LoginLogQueryDto): Promise<{
        id: number;
        status: string;
        username: string;
        message: string | null;
        ip: string;
        userAgent: string;
        loginTime: Date;
    }[]>;
}
