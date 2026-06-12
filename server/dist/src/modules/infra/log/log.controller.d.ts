import { LogService } from './log.service';
export declare class LogController {
    private logService;
    constructor(logService: LogService);
    findAll(): Promise<{
        path: string;
        id: number;
        status: number;
        createdAt: Date;
        type: string;
        username: string | null;
        userId: number | null;
        description: string;
        duration: number;
        module: string;
        method: string;
        ip: string;
    }[]>;
}
