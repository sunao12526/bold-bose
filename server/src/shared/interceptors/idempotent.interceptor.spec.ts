import { BadRequestException, CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of, throwError } from 'rxjs';
import { IdempotentInterceptor } from './idempotent.interceptor';
import { RedisService } from '../redis/redis.service';

describe('IdempotentInterceptor', () => {
  let interceptor: IdempotentInterceptor;
  let reflector: jest.Mocked<Reflector>;
  let redisService: jest.Mocked<Pick<RedisService, 'acquireLock' | 'releaseLock'>>;

  const createContext = (reqOverrides: Record<string, any> = {}): ExecutionContext =>
    ({
      getHandler: () => (() => undefined),
      getClass: () => class TestController {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 10 },
          method: 'POST',
          originalUrl: '/admin-api/mall/order',
          body: { skuId: 1, count: 2 },
          ip: '127.0.0.1',
          ...reqOverrides,
        }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    redisService = {
      acquireLock: jest.fn(),
      releaseLock: jest.fn(),
    };
    interceptor = new IdempotentInterceptor(
      reflector,
      redisService as unknown as RedisService,
    );
  });

  it('未标注 @Idempotent 时应直接透传不加锁', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const next: CallHandler = { handle: () => of({ ok: true }) };

    const obs = await interceptor.intercept(createContext(), next);
    const result = await lastValueFrom(obs);

    expect(result).toEqual({ ok: true });
    expect(redisService.acquireLock).not.toHaveBeenCalled();
  });

  it('标注 @Idempotent 且抢锁成功时应放行请求', async () => {
    reflector.getAllAndOverride.mockReturnValue({
      timeoutMs: 5000,
      keyPrefix: 'order',
    });
    redisService.acquireLock.mockResolvedValue('lock-token-abc');
    const next: CallHandler = { handle: () => of({ id: 99 }) };

    const obs = await interceptor.intercept(createContext(), next);
    const result = await lastValueFrom(obs);

    expect(result).toEqual({ id: 99 });
    expect(redisService.acquireLock).toHaveBeenCalledWith(
      expect.stringMatching(/^idempotent:order:u:10:POST:\/admin-api\/mall\/order:[0-9a-f]{16}$/),
      5000,
    );
  });

  it('并发重复请求抢锁失败时应抛出 BadRequestException', async () => {
    reflector.getAllAndOverride.mockReturnValue({
      message: '请勿重复下单',
    });
    redisService.acquireLock.mockResolvedValue(null);
    const next: CallHandler = { handle: () => of({ id: 99 }) };

    await expect(
      interceptor.intercept(createContext(), next),
    ).rejects.toThrow(new BadRequestException('请勿重复下单'));
  });

  it('业务处理异常且 deleteOnError=true（默认）时应立即释放锁', async () => {
    reflector.getAllAndOverride.mockReturnValue({});
    redisService.acquireLock.mockResolvedValue('lock-token-err');
    redisService.releaseLock.mockResolvedValue(true);
    const next: CallHandler = {
      handle: () => throwError(() => new Error('DB timeout')),
    };

    const obs = await interceptor.intercept(createContext(), next);
    await expect(lastValueFrom(obs)).rejects.toThrow('DB timeout');

    expect(redisService.releaseLock).toHaveBeenCalledWith(
      expect.any(String),
      'lock-token-err',
    );
  });
});
