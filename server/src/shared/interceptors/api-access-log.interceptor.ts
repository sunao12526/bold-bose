import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { safeJsonStringify } from '../utils/sanitize.util';

@Injectable()
export class ApiAccessLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ApiAccessLogInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const method = String(request.method || 'GET').toUpperCase();
    const requestUrl = String(request.originalUrl || request.url || '');

    // 跳过日志查询自身及 Swagger 文档路径，避免产生噪声循环
    if (
      (method === 'GET' &&
        (requestUrl.includes('/infra/api-access-log') ||
          requestUrl.includes('/infra/api-error-log'))) ||
      requestUrl.includes('/admin-api/docs')
    ) {
      return next.handle();
    }

    const beginTime = new Date();
    const startMs = Date.now();

    return next.handle().pipe(
      tap((responseData) => {
        this.recordLog(request, beginTime, startMs, 200, 'success', responseData);
      }),
      catchError((err) => {
        const resultCode = err?.status || err?.getStatus?.() || 500;
        const resultMsg = err?.message || 'error';
        this.recordLog(request, beginTime, startMs, resultCode, resultMsg, null);
        return throwError(() => err);
      }),
    );
  }

  private recordLog(
    request: any,
    beginTime: Date,
    startMs: number,
    resultCode: number,
    resultMsg: string,
    responseData: unknown,
  ): void {
    const endTime = new Date();
    const duration = Math.max(0, Date.now() - startMs);
    const userIp = this.extractIp(request);
    const userAgent = String(request.headers?.['user-agent'] || '').slice(0, 512);
    const requestParams = safeJsonStringify({
      query: request.query,
      body: request.body,
    });
    const responseBody =
      responseData && !Buffer.isBuffer(responseData)
        ? safeJsonStringify(responseData, 2000)
        : null;

    const traceId = request.headers?.['x-trace-id']
      ? String(request.headers['x-trace-id']).slice(0, 64)
      : null;

    this.prisma.infraApiAccessLog
      .create({
        data: {
          traceId,
          userId: request.user?.id ?? null,
          userType: request.user?.userType ?? 2,
          requestMethod: String(request.method || 'GET').slice(0, 16),
          requestUrl: String(request.originalUrl || request.url || '').slice(0, 500),
          requestParams,
          responseBody,
          userIp: userIp.slice(0, 50),
          userAgent,
          beginTime,
          endTime,
          duration,
          resultCode,
          resultMsg: String(resultMsg || '').slice(0, 500),
        },
      })
      .catch((err) => {
        this.logger.error(`Failed to persist API access log: ${err?.message || err}`);
      });
  }

  private extractIp(request: any): string {
    let ip =
      request.ip ||
      request.headers?.['x-forwarded-for'] ||
      request.socket?.remoteAddress ||
      '';
    if (Array.isArray(ip)) {
      ip = ip[0] || '';
    }
    if (typeof ip === 'string' && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    return String(ip || '');
  }
}
