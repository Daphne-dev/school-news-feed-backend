import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { ErrorCode, ERROR_CODE, isErrorCode } from './error.constant';

import type { Response } from 'express';

/**
 * 서버에 정의된 HttpException들을 처리
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();
    const { method, url } = request;

    // 에러 기본 값을 INTERNAL_SERVER_ERROR로 지정
    const errorInfo: ErrorCode<string> = ERROR_CODE.INTERNAL_SERVER_ERROR;

    // 정의된 에러코드인 경우 에러코드 전달
    if (isErrorCode(exceptionResponse)) {
      errorInfo.errorCode = exceptionResponse.errorCode;
      errorInfo.message = exceptionResponse.message;
      errorInfo.status = exceptionResponse.status;
    } else {
      // 정의되지 않은 에러코드인 경우 에러 메시지와 상태코드만 전달
      errorInfo.message = exception.message;
      errorInfo.status = exception.getStatus();
    }

    //  내부적으로 발생한 에러 내용을 알기 위해 로깅
    if (errorInfo.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(`[Exception][${method}] ${url}] ${exception.message}`, exception.stack);
    }

    // 외부에는 일관성 있게 서버에 정의된 에러만 보내도록 처리
    response.status(errorInfo.status).json({ ...errorInfo, timestamp: new Date().toISOString(), path: url });
  }
}
