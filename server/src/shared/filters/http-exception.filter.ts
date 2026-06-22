import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

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

    if (exception instanceof HttpException) {
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

    response.status(status).json({
      code,
      message: Array.isArray(message) ? message[0] : message,
      data,
    });
  }
}
