import { PrismaService } from '../../../shared/prisma/prisma.service';
import { NotifyService } from '../../pay/notify.service';
export declare class JobHandlers {
    private prisma;
    private notifyService;
    private readonly logger;
    constructor(prisma: PrismaService, notifyService: NotifyService);
    logCleanupJob(): Promise<void>;
    demoTaskJob(): Promise<void>;
    sessionCleanupJob(): Promise<void>;
    payNotifyJob(): Promise<void>;
}
