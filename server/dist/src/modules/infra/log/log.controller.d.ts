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
        module: string;
        description: string;
        method: string;
        ip: string;
        duration: number;
    }[]>;
}
