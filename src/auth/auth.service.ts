import { BadRequestException, Injectable } from '@nestjs/common';

import { LoginParam, LogoutParam, RefreshParam } from './auth.interface';
import { ERROR_CODE } from '../common/filters/error.constant';
import { REFRESH_JWT_EXPIRE } from '../common/jwt/jwt-utility.constants';
import { JwtUtilityService } from '../common/jwt/jwt-utility.service';
import { RedisService } from '../common/redis/redis.service';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtUtilityService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 로그인
   */
  async login(loginParam: LoginParam) {
    const { email, password } = loginParam;

    const user = await this.userService.findOneByEmailAndPassword({ email, password });

    const accessToken = await this.jwtService.generateAuthToken({ id: user.id });
    const refreshToken = await this.jwtService.generateRefreshToken({ id: user.id });
    const refreshTokenKey = this.redisService.generateKey('user', user.id.toString(), 'refreshToken');
    await this.redisService.set(refreshTokenKey, refreshToken, REFRESH_JWT_EXPIRE);

    return { accessToken, refreshToken };
  }

  /**
   * 로그아웃
   */
  async logout(logoutParam: LogoutParam) {
    const { userId } = logoutParam;

    const user = await this.userService.findOneById({ userId });

    const refreshTokenKey = this.redisService.generateKey('user', user.id.toString(), 'refreshToken');

    // redis refresh token 삭제 처리
    await this.redisService.del(refreshTokenKey);
  }

  /**
   * 토큰 갱신
   */
  async refresh(refreshParam: RefreshParam) {
    const { userId } = refreshParam;

    const refreshTokenKey = this.redisService.generateKey('user', userId.toString(), 'refreshToken');
    const user = await this.redisService.get(refreshTokenKey);

    if (!user) {
      throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND);
    }

    const accessToken = await this.jwtService.generateAuthToken({ id: userId });
    const refreshToken = await this.jwtService.generateRefreshToken({ id: userId });

    return {
      accessToken,
      refreshToken,
    };
  }
}
