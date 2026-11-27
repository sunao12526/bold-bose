import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { PrismaService } from '../prisma/prisma.service';
import { safeJsonStringify } from '../utils/sanitize.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;


    // Extract request details to log structurally
    const errorDetails = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      body: request.body,
      query: request.query,
      exception:
        exception instanceof Error
          ? {
              message: exception.message,
              stack: exception.stack,
            }
          : exception,
    };

    if (status >= 500) {
      this.logger.error(
        `HTTP 500 Error: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : undefined,
        errorDetails,
      );
    } else {
      this.logger.warn(
        `HTTP ${status} Warning: ${request.method} ${request.url}`,
        errorDetails,
      );
    }

    let code = status;
    let message = '服务器内部错误';
    let data: any = null;

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as any;
      const firstIssue = zodError.issues[0];
      message = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : exception.message;
      code = HttpStatus.BAD_REQUEST;
      data = zodError.format();
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || exception.message;
        code = (res as any).statusCode || status;
        data = (res as any).error || null;
      } else {
        message = String(res) || exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const finalMessage = Array.isArray(message) ? message[0] : message;

    if (
      this.prisma &&
      (status >= 500 || process.env.API_ERROR_LOG_ALL === 'true')
    ) {
      const reqAny = request as any;
      const exceptionName =
        exception instanceof Error
          ? exception.constructor?.name || exception.name || 'Error'
          : 'UnknownException';
      const exceptionStack =
        exception instanceof Error ? exception.stack?.slice(0, 8000) || null : null;
      const userIp = String(
        request.ip ||
          request.headers['x-forwarded-for'] ||
          request.socket?.remoteAddress ||
          '',
      ).slice(0, 50);

      this.prisma.infraApiErrorLog
        .create({
          data: {
            traceId: request.headers['x-trace-id']
              ? String(request.headers['x-trace-id']).slice(0, 64)
              : null,
            userId: reqAny.user?.id ?? null,
            userType: reqAny.user?.userType ?? 2,
            requestMethod: String(request.method || 'GET').slice(0, 16),
            requestUrl: String(request.originalUrl || request.url || '').slice(0, 500),
            requestParams: safeJsonStringify({
              query: request.query,
              body: request.body,
            }),
            userIp,
            userAgent: String(request.headers['user-agent'] || '').slice(0, 512),
            exceptionTime: new Date(),
            exceptionName: exceptionName.slice(0, 128),
            exceptionMessage: String(finalMessage || '服务器内部错误').slice(0, 4000),
            exceptionStackTrace: exceptionStack,
            processStatus: 0,
          },
        })
        .catch((err) => {
          this.logger.error(`Failed to persist API error log: ${err?.message || err}`);
        });
    }

    response.status(status).json({
      code,
      message: finalMessage,
      data,
    });
  }
}
