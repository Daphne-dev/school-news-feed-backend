import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtUtilityService } from './jwt-utility.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow<string>('JWT_EXPIRE'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtUtilityService],
  exports: [JwtUtilityService],
})
export class JwtUtilityModule {}
