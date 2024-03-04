import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UserRole } from '../user.enum';

export class CreateUserRequestBodyDto {
  @ApiProperty({ description: '이메일', example: 'test@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '이름', example: '김동현' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '비밀번호', example: 'test1234' })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @ApiProperty({ description: '이메일', example: UserRole.STUDENT })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
