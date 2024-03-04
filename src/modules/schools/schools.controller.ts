import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateSchoolPageRequestBodyDto, CreateSchoolPageResponseDto } from './dto/create-school.dto';
import { SchoolsService } from './schools.service';
import { GenerateSwaggerDocumentByErrorCode } from '../../common/decorators/generate-swagger-document-by-error-code';
import { UserInfo } from '../../common/decorators/jwt.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ERROR_CODE } from '../../common/filters/error.constant';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtPayload } from '../../common/jwt/jwt-utility.interface';
import { UserRole } from '../user/user.enum';

@Controller('schools')
@ApiTags('학교')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ApiOperation({
    summary: '학교 페이지 생성',
    description: '학교 페이지를 생성합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.ACCESS_DENIED])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createSchoolPage(
    @UserInfo() user: JwtPayload,
    @Body() createSchoolPageRequestBodyDto: CreateSchoolPageRequestBodyDto,
  ): Promise<CreateSchoolPageResponseDto> {
    const result = await this.schoolsService.create({
      name: createSchoolPageRequestBodyDto.name,
      region: createSchoolPageRequestBodyDto.region,
      schoolAdminId: user.id,
    });
    return new CreateSchoolPageResponseDto(result);
  }
}
