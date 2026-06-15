import { LogService } from './log.service';
export declare class LogController {
    private logService;
    constructor(logService: LogService);
    findAll(): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        type: string;
        path: string;
        username: string | null;
        userId: number | null;
        description: string;
        ip: string;
        method: string;
        duration: number;
        module: string;
    }[]>;
}
