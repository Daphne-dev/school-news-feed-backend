import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateSchoolParam, FindSchoolByIdParam, IsSchoolAdminParam } from './schools.interface';
import { ERROR_CODE } from '../../common/filters/error.constant';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 학교 페이지 생성
   */
  async create(createSchoolParam: CreateSchoolParam) {
    const { name, region, schoolAdminId } = createSchoolParam;

    const school = await this.prismaService.school.create({
      data: {
        name,
        region,
        schoolAdmins: {
          create: {
            userId: schoolAdminId,
          },
        },
      },
    });

    return {
      schoolId: school.id,
    };
  }

  /**
   * 학교 페이지 조회
   */
  async findById(findSchoolByIdParam: FindSchoolByIdParam) {
    const { schoolId } = findSchoolByIdParam;

    const school = await this.prismaService.school.findFirst({
      where: {
        id: schoolId,
      },
    });
    if (!school) {
      throw new BadRequestException(ERROR_CODE.SCHOOL_NOT_FOUND);
    }

    return school;
  }

  /**
   * 학교 관리자 권한 조회
   */
  async isSchoolAdmin(isSchoolAdminParam: IsSchoolAdminParam): Promise<boolean> {
    const { schoolId, userId } = isSchoolAdminParam;

    const admin = await this.prismaService.schoolAdmin.findFirst({
      where: {
        schoolId,
        userId,
      },
    });

    return !!admin;
  }
}
