import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserCacheService } from '../user-cache.service';
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private userCache;
    constructor(reflector: Reflector, userCache: UserCacheService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
