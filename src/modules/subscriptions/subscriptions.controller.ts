import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetSubscribedSchoolsRequestQueryDto, GetSubscribedSchoolsResponseDto } from './dto/get-subscribed-schools.dto';
import { SubscribeToSchoolRequestBodyDto, SubscribeToSchoolResponseDto } from './dto/subscribe-school.dto';
import { UnsubscribeToSchoolRequestBodyDto } from './dto/unsubscribe-school.dto';
import { SubscriptionsService } from './subscriptions.service';
import { GenerateSwaggerDocumentByErrorCode } from '../../common/decorators/generate-swagger-document-by-error-code';
import { UserInfo } from '../../common/decorators/jwt.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ERROR_CODE } from '../../common/filters/error.constant';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtPayload } from '../../common/jwt/jwt-utility.interface';
import { UserRole } from '../user/user.enum';

@Controller('subscriptions')
@ApiTags('학교 구독')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiOperation({
    summary: '학교 페이지 구독',
    description: '학교 페이지를 구독합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.ACCESS_DENIED,
    ERROR_CODE.SCHOOL_NOT_FOUND,
    ERROR_CODE.SUBSCRIBED_ALREADY,
  ])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post()
  async subscribeToSchool(
    @UserInfo() user: JwtPayload,
    @Body() subscribeToSchoolRequestBodyDto: SubscribeToSchoolRequestBodyDto,
  ): Promise<SubscribeToSchoolResponseDto> {
    const result = await this.subscriptionsService.subscribeToSchool({
      schoolId: subscribeToSchoolRequestBodyDto.schoolId,
      userId: user.id,
    });
    return new SubscribeToSchoolResponseDto(result);
  }

  @ApiOperation({
    summary: '학교 페이지 구독 취소',
    description: '학교 페이지 구독을 취소합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.ACCESS_DENIED, ERROR_CODE.NOT_SUBSCRIBED])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Delete()
  async unsubscribeFromSchool(
    @UserInfo() user: JwtPayload,
    @Body() unsubscribeToSchoolRequestBodyDto: UnsubscribeToSchoolRequestBodyDto,
  ): Promise<void> {
    await this.subscriptionsService.unsubscribeFromSchool({
      schoolId: unsubscribeToSchoolRequestBodyDto.schoolId,
      userId: user.id,
    });
  }

  @ApiOperation({
    summary: '구독한 학교 페이지를 조회',
    description: '구독한 학교 페이지를 조회합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.ACCESS_DENIED,
    ERROR_CODE.SCHOOL_NOT_FOUND,
    ERROR_CODE.SUBSCRIBED_ALREADY,
  ])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('/schools')
  async getSubscribedSchools(
    @UserInfo() user: JwtPayload,
    @Query() getSubscribedSchoolsRequestQueryDto: GetSubscribedSchoolsRequestQueryDto,
  ): Promise<GetSubscribedSchoolsResponseDto> {
    const result = await this.subscriptionsService.findSubscribedSchools({
      userId: user.id,
      page: getSubscribedSchoolsRequestQueryDto.page,
      pageSize: getSubscribedSchoolsRequestQueryDto.pageSize,
    });
    return new GetSubscribedSchoolsResponseDto(result);
  }
}
