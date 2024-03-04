import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtUtilityModule } from '../common/jwt/jwt-utility.module';
import { RedisModule } from '../common/redis/redis.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [JwtUtilityModule, UserModule, RedisModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
