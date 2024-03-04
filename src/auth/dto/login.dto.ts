import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class LoginRequestBodyDto {
  @ApiProperty({ description: '이메일', example: 'test@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'test1234' })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}

@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    description: 'access token',
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'refresh token',
  })
  refreshToken: string;

  constructor(data: LoginResponseDto) {
    Object.assign(this, data);
  }
}
