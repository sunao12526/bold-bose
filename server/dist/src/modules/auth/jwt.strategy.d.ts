import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    validate(req: any, payload: {
        id: number;
        username: string;
    }): Promise<{
        id: number;
        username: string;
        nickname: string;
        sessionId: string;
    }>;
}
export {};
