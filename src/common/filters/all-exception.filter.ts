import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

import { ErrorCode, ERROR_CODE } from './error.constant';

import type { Response } from 'express';

/**
 * HttpExceptionFilter로 잡히지 않는 모든 내부 에러를 처리
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url } = request;

    // 에러 기본 값을 INTERNAL_SERVER_ERROR로 지정
    const errorInfo: ErrorCode<string> = ERROR_CODE.INTERNAL_SERVER_ERROR;

    // 내부적으로 발생한 에러 내용을 알기 위해 로깅
    Logger.error(`[Exception][${method}] ${url}] 서비스에서 핸들링하지 않은 에러 발생 ${exception}`);

    response.status(errorInfo.status).json({ ...errorInfo, timestamp: new Date().toISOString(), path: request.url });
  }
}
