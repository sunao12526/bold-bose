import { OAuth2Service } from './oauth2.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class OAuth2Controller {
    private readonly oauth2Service;
    private readonly jwtService;
    private readonly prisma;
    constructor(oauth2Service: OAuth2Service, jwtService: JwtService, prisma: PrismaService);
    authorize(clientId: string, redirectUri: string, responseType: string, scopeStr: string, state: string, req: any, res: any): Promise<any>;
    token(grantType: string, code: string, clientId: string, clientSecret: string, redirectUri: string): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
    } | {
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token?: undefined;
        scope?: undefined;
    }>;
    userinfo(req: any): Promise<{
        client_id: any;
        scopes: any;
        sub?: undefined;
        id?: undefined;
        username?: undefined;
        nickname?: undefined;
        email?: undefined;
        mobile?: undefined;
    } | {
        sub: string;
        id: number;
        username: string;
        nickname: string;
        email: string | null;
        mobile: string | null;
        client_id?: undefined;
        scopes?: undefined;
    }>;
}
