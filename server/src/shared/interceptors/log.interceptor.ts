import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { LOG_METADATA_KEY, LogOptions } from '../decorators/log.decorator';
import { IpService } from '../ip/ip.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private ipService: IpService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const logOptions = this.reflector.getAllAndOverride<LogOptions>(
      LOG_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      tap(() => {
        if (logOptions) {
          const duration = Date.now() - startTime;
          this.saveLog(request, logOptions, 200, duration);
        }
      }),
      catchError((err) => {
        if (logOptions) {
          const duration = Date.now() - startTime;
          const status = err.status || 500;
          this.saveLog(request, logOptions, status, duration);
        }
        return throwError(() => err);
      }),
    );
  }

  private async saveLog(
    request: any,
    options: LogOptions,
    status: number,
    duration: number,
  ) {
    try {
      const user = request.user;
      let ip = request.ip || request.headers['x-forwarded-for'] || '';
      if (Array.isArray(ip)) {
        ip = ip[0];
      }
      if (!ip && request.socket) {
        ip = request.socket.remoteAddress;
      }

      const location = await this.ipService.search(ip);

      await this.prisma.operationLog.create({
        data: {
          userId: user?.id || null,
          username: user?.username || null,
          module: options.module,
          type: options.type,
          description: options.description,
          path: request.url,
          method: request.method,
          ip: typeof ip === 'string' ? ip.substring(0, 50) : '',
          location,
          status,
          duration,
        },
      });
    } catch (e) {
      this.logger.error('Failed to save operation log:', e);
    }
  }
}
