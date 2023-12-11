import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;

    this.logger.log(
      `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        this.logger.log(`          
           ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${
             Date.now() - now
           }ms`);
      }),
      catchError((err) => {
        this.logger.error(err);
        return throwError(() => err);
      }),
    );
  }
}
