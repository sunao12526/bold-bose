import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KEEP_METADATA_KEY } from '../decorators/keep.decorator';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const keep = this.reflector.getAllAndOverride<boolean>(KEEP_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (keep) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'success',
        data: data ?? null,
      })),
    );
  }
}
