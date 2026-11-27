import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IDEMPOTENT_METADATA_KEY,
  IdempotentOptions,
} from '../decorators/idempotent.decorator';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class IdempotentInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const options = this.reflector.getAllAndOverride<IdempotentOptions>(
      IDEMPOTENT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const timeoutMs = options.timeoutMs ?? 3000;
    const message = options.message ?? '请勿重复提交请求';
    const deleteOnError = options.deleteOnError ?? true;

    const lockKey = this.buildLockKey(request, options.keyPrefix);
    const lockToken = await this.redisService.acquireLock(lockKey, timeoutMs);

    if (!lockToken) {
      throw new BadRequestException(message);
    }

    return next.handle().pipe(
      catchError((err) => {
        if (deleteOnError) {
          void this.redisService.releaseLock(lockKey, lockToken);
        }
        return throwError(() => err);
      }),
    );
  }

  private buildLockKey(request: any, keyPrefix?: string): string {
    const identity = request.user?.id
      ? `u:${request.user.id}`
      : `ip:${request.ip || request.headers?.['x-forwarded-for'] || 'unknown'}`;
    const method = request.method || 'UNKNOWN';
    const url = request.originalUrl || request.url || '';
    const bodyHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(request.body ?? {}))
      .digest('hex')
      .slice(0, 16);

    const prefix = keyPrefix ? `${keyPrefix}:` : '';
    return `idempotent:${prefix}${identity}:${method}:${url}:${bodyHash}`;
  }
}
