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

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

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

    response.status(status).json(
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: status,
            message: '服务器内部错误',
            error: 'Internal Server Error',
          },
    );
  }
}
