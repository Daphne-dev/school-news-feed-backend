import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

import { ERROR_CODE } from '../filters/error.constant';
import { RefreshJwtPayload } from '../jwt/jwt-utility.interface';
import { JwtUtilityService } from '../jwt/jwt-utility.service';

import type { Request } from 'express';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(private readonly jwtUtilityService: JwtUtilityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: RefreshJwtPayload }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new BadRequestException(ERROR_CODE.REFRESH_TOKEN_NOT_FOUND);

    try {
      const payload = await this.jwtUtilityService.validateRefreshToken(token);
      request.user = payload;
    } catch (error) {
      // Refresh JWT 만료 에러 처리
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(ERROR_CODE.REFRESH_TOKEN_EXPIRED);
      } else {
        // 기타 Refresh JWT 유효성 검증 에러 처리
        throw new UnauthorizedException(ERROR_CODE.INVALID_TOKEN);
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
