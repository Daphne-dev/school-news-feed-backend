import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface ErrorCode<T> {
  errorCode: T;
  message: string;
  status: HttpStatus;
}

export class ErrorExceptionDto {
  @ApiProperty({ description: '에러코드', example: 0 })
  errorCode: number;

  @ApiProperty({ description: '상태 코드', example: 500 })
  status: number;

  @ApiProperty({ description: '메시지', example: '' })
  message: string;
}

const dynamicRecord = <T extends { [key in keyof T]: ErrorCode<key> }>(
  errorObject: T,
): T & Record<string, ErrorCode<keyof T>> => errorObject;

export const isErrorCode = (object: object | string): object is ErrorCode<string> => {
  return typeof object === 'object' && object !== null && 'errorCode' in object && 'message' in object;
};

export const ERROR_CODE = dynamicRecord({
  /**
   * 공통
   */
  INVALID_DATA: { errorCode: 'INVALID_DATA', message: '입력값이 올바르지 않습니다.', status: HttpStatus.BAD_REQUEST },
  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: '서버에 오류가 발생했습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  /**
   * 인증
   */
  INVALID_TOKEN: {
    errorCode: 'INVALID_TOKEN',
    message: '유효하지 않은 토큰입니다.',
    status: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_EXPIRED: {
    errorCode: 'TOKEN_EXPIRED',
    message: '토큰이 만료되었습니다.',
    status: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_NOT_PROVIDED: {
    errorCode: 'TOKEN_NOT_PROVIDED',
    message: '토큰이 제공되지 않았습니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  REFRESH_TOKEN_NOT_FOUND: {
    errorCode: 'REFRESH_TOKEN_NOT_FOUND',
    message: '리프레시 토큰을 찾을 수 없습니다.',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_EXPIRED: {
    errorCode: 'REFRESH_TOKEN_EXPIRED',
    message: '리프레시 토큰이 만료되었습니다.',
    status: HttpStatus.UNAUTHORIZED,
  },

  /** 인가 */
  ACCESS_DENIED: {
    errorCode: 'ACCESS_DENIED',
    message: '접근 권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },

  /**
   * 유저
   */
  USER_ALREADY_EXISTS: {
    errorCode: 'USER_ALREADY_EXISTS',
    message: '이미 가입된 유저입니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  USER_NOT_FOUND: {
    errorCode: 'USER_NOT_FOUND',
    message: '존재하지 않는 유저입니다.',
    status: HttpStatus.BAD_REQUEST,
  },

  /**
   * 학교
   */
  SCHOOL_NOT_FOUND: {
    errorCode: 'SCHOOL_NOT_FOUND',
    message: '존재하지 않는 학교입니다.',
    status: HttpStatus.NOT_FOUND,
  },

  /**
   * 학교 소식
   */
  SCHOOL_NEWS_NOT_FOUND: {
    errorCode: 'SCHOOL_NEWS_NOT_FOUND',
    message: '존재하지 않는 학교 소식입니다.',
    status: HttpStatus.NOT_FOUND,
  },

  /**
   * 학교 구독
   */
  SUBSCRIBED_ALREADY: {
    errorCode: 'SUBSCRIBED_ALREADY',
    message: '이미 구독되어 있습니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  NOT_SUBSCRIBED: {
    errorCode: 'NOT_SUBSCRIBED',
    message: '구독 되어있지 않습니다.',
    status: HttpStatus.BAD_REQUEST,
  },
});
