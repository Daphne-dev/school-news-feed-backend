import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { JwtPayload } from './jwt-utility.interface';

@Injectable()
export class JwtUtilityService {
  private readonly JWT_SECRET: string;

  private readonly JWT_EXPIRE: string;

  private readonly REFRESH_JWT_SECRET: string;

  private readonly REFRESH_JWT_EXPIRE: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_SECRET = this.configService.getOrThrow<string>('JWT_SECRET');
    this.JWT_EXPIRE = this.configService.getOrThrow<string>('JWT_EXPIRE');
    this.REFRESH_JWT_SECRET = this.configService.getOrThrow<string>('REFRESH_JWT_SECRET');
    this.REFRESH_JWT_EXPIRE = this.configService.getOrThrow<string>('REFRESH_JWT_EXPIRE');
  }

  async generateAuthToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_EXPIRE,
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.REFRESH_JWT_SECRET,
      expiresIn: this.REFRESH_JWT_EXPIRE,
    });
  }

  async validationAuthToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.JWT_SECRET,
    });
  }

  async validateRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.REFRESH_JWT_SECRET,
    });
  }
}
