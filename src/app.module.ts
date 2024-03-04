import {
  BadRequestException,
  ClassSerializerInterceptor,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ERROR_CODE } from './common/filters/error.constant';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NewsModule } from './modules/news/news.module';
import { SchoolModule } from './modules/schools/schools.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}` }),
    AuthModule,
    UserModule,
    SchoolModule,
    NewsModule,
    SubscriptionsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // payload를 DTO로 변환
        forbidUnknownValues: true, // 알 수 없는 속성이 있으면 에러를 발생시킵니다.
        exceptionFactory: (errors: ValidationError[]) => {
          // formattedErrors는 모든 유효성 검사 에러 메시지의 배열입니다.
          // 이 배열의 모든 메시지를 조인하여 단일 문자열로 만듭니다.
          const formatErrors = errors.flatMap((error) => Object.values(error.constraints || {})).join(', ');

          throw new BadRequestException({ ...ERROR_CODE.INVALID_DATA, message: formatErrors });
        },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
