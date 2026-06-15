import { LogService } from './log.service';
export declare class LogController {
    private logService;
    constructor(logService: LogService);
    findAll(): Promise<{
        id: number;
        username: string | null;
        status: number;
        createdAt: Date;
        userId: number | null;
        type: string;
        ip: string;
        path: string;
        method: string;
        description: string;
        duration: number;
        module: string;
    }[]>;
}
