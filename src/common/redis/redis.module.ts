import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule as RedisDefaultModule } from '@nestjs-modules/ioredis';

import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisDefaultModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('REDIS_HOST');
        const port = configService.getOrThrow<number>('REDIS_PORT');
        const url = `redis://${host}:${port}`;
        return {
          type: 'single',
          url,
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
