import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { CreateUserParam, FindOneByEmailAndPasswordParam, FindOneUserByIdParam } from './user.interface';
import { ERROR_CODE } from '../../common/filters/error.constant';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 회원가입
   */
  async create(createUserParam: CreateUserParam): Promise<void> {
    const { email, name, password, role } = createUserParam;

    const existingUser = await this.prismaService.user.findFirst({ where: { email } });
    if (existingUser) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashPassword,
        role,
      },
    });
  }

  /**
   * 이메일, 비밀번호 기반 유저 조회
   */
  async findOneByEmailAndPassword(findOneByEmailAndPasswordParam: FindOneByEmailAndPasswordParam) {
    const { email, password } = findOneByEmailAndPasswordParam;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND);
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND);
    }

    return user;
  }

  async findOneById(findOneUserByIdParam: FindOneUserByIdParam) {
    const { userId } = findOneUserByIdParam;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND);
    }

    return user;
  }
}
