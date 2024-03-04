import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserRequestBodyDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { GenerateSwaggerDocumentByErrorCode } from '../../common/decorators/generate-swagger-document-by-error-code';
import { ERROR_CODE } from '../../common/filters/error.constant';

@Controller('user')
@ApiTags('회원')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '회원 생성',
    description: '이메일 기반 회원을 생성합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.USER_ALREADY_EXISTS])
  async createUser(@Body() createUserRequestBodyDto: CreateUserRequestBodyDto): Promise<void> {
    return this.userService.create({
      email: createUserRequestBodyDto.email,
      name: createUserRequestBodyDto.name,
      password: createUserRequestBodyDto.password,
      role: createUserRequestBodyDto.role,
    });
  }
}
