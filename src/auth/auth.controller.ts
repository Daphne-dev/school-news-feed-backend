import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginRequestBodyDto, LoginResponseDto } from './dto/login.dto';
import { RefreshJwtResponseDto } from './dto/refresh-jwt.dto';
import { GenerateSwaggerDocumentByErrorCode } from '../common/decorators/generate-swagger-document-by-error-code';
import { RefreshJwtInfo, UserInfo } from '../common/decorators/jwt.decorator';
import { ERROR_CODE } from '../common/filters/error.constant';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RefreshJwtGuard } from '../common/guards/refresh-jwt.guard';
import { JwtPayload, RefreshJwtPayload } from '../common/jwt/jwt-utility.interface';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: '로그인을 합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.USER_NOT_FOUND])
  @Post('login')
  async login(@Body() loginRequestBodyDto: LoginRequestBodyDto): Promise<LoginResponseDto> {
    const result = await this.authService.login({
      email: loginRequestBodyDto.email,
      password: loginRequestBodyDto.password,
    });
    return new LoginResponseDto(result);
  }

  @ApiOperation({ summary: '로그아웃', description: '로그아웃을 합니다.' })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.USER_NOT_FOUND])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@UserInfo() user: JwtPayload): Promise<void> {
    return this.authService.logout({ userId: user.id });
  }

  @ApiOperation({
    summary: '토큰 갱신',
    description: 'Refresh token으로 토큰을 갱신합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.USER_NOT_FOUND])
  @ApiBearerAuth('refresh-jwt')
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@RefreshJwtInfo() user: RefreshJwtPayload): Promise<RefreshJwtResponseDto> {
    const result = await this.authService.refresh({
      userId: user.id,
    });
    return new RefreshJwtResponseDto(result);
  }
}
