import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ERROR_CODE, ErrorCode } from '../filters/error.constant';

const createApiResponseForStatusCode = (statusCode: number, errorCodes: ErrorCode<string>[]) => {
  const initialGroup: Record<string, { type: string; properties: Record<string, unknown> }> = {};
  const schemaProperties = errorCodes.reduce((acc, { errorCode, message }) => {
    acc[errorCode] = {
      type: 'object',
      properties: {
        errorCode: { type: 'string', example: errorCode },
        status: { type: 'integer', example: statusCode },
        message: { type: 'string', example: message },
      },
    };
    return acc;
  }, initialGroup);

  const response = {
    status: statusCode,
    schema: {
      allOf: [
        {
          properties: schemaProperties,
        },
      ],
    },
  };
  return ApiResponse(response);
};

/**
 * swagger 에러 코드 설명을 위한 데코레이터
 * 서버에서 발생할 수 있는 정의된 에러들을 설명
 */
export const GenerateSwaggerDocumentByErrorCode = (errorCodes: ErrorCode<string>[]) => {
  // 에러 코드를 상태 코드별로 그룹화
  const initialGroup: Record<number, ErrorCode<string>[]> = {};
  const groupedByStatusCode = [ERROR_CODE.INVALID_DATA, ERROR_CODE.INTERNAL_SERVER_ERROR, ...errorCodes].reduce(
    (acc, errorCode) => {
      (acc[errorCode.status] = acc[errorCode.status] || []).push(errorCode);
      return acc;
    },
    initialGroup,
  );

  // 각 상태 코드에 대한 ApiResponse 데코레이터 생성
  const responseDecorators = Object.entries(groupedByStatusCode).map(([status, codes]) =>
    createApiResponseForStatusCode(parseInt(status, 10), codes),
  );

  return applyDecorators(...responseDecorators);
};
