import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateNewsRequestBodyDto, CreateNewsResponseDto } from './dto/create-news.dto';
import {
  GetSubscribedSchoolNewsRequestQueryDto,
  GetSubscribedSchoolNewsResponseDto,
} from './dto/get-subscribed-news.dto';
import { UpdateNewsRequestBodyDto, UpdateNewsResponseDto } from './dto/update-news.dto';
import { NewsService } from './news.service';
import { GenerateSwaggerDocumentByErrorCode } from '../../common/decorators/generate-swagger-document-by-error-code';
import { UserInfo } from '../../common/decorators/jwt.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ERROR_CODE } from '../../common/filters/error.constant';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtPayload } from '../../common/jwt/jwt-utility.interface';
import { UserRole } from '../user/user.enum';

@Controller('schools/:schoolId/news')
@ApiTags('학교 소식')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiOperation({
    summary: '학교 소식 생성',
    description: '학교 소식을 생성합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.ACCESS_DENIED])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createSchoolNews(
    @UserInfo() user: JwtPayload,
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createNewsRequestBodyDto: CreateNewsRequestBodyDto,
  ): Promise<CreateNewsResponseDto> {
    const result = await this.newsService.create({
      title: createNewsRequestBodyDto.title,
      content: createNewsRequestBodyDto.content,
      schoolId,
      userId: user.id,
    });
    return new CreateNewsResponseDto(result);
  }

  @ApiOperation({
    summary: '학교 소식 수정',
    description: '학교 소식을 수정합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.ACCESS_DENIED, ERROR_CODE.SCHOOL_NEWS_NOT_FOUND])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':newsId')
  async updateSchoolNews(
    @UserInfo() user: JwtPayload,
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Param('newsId', ParseIntPipe) newsId: number,
    @Body() updateNewsRequestBodyDto: UpdateNewsRequestBodyDto,
  ): Promise<UpdateNewsResponseDto> {
    const result = await this.newsService.update({
      newsId,
      title: updateNewsRequestBodyDto.title,
      content: updateNewsRequestBodyDto.content,
      schoolId,
      userId: user.id,
    });
    return new UpdateNewsResponseDto(result);
  }

  @ApiOperation({
    summary: '학교 소식 삭제',
    description: '학교 소식을 삭제합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.ACCESS_DENIED, ERROR_CODE.SCHOOL_NEWS_NOT_FOUND])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':newsId')
  async deleteSchoolNews(
    @UserInfo() user: JwtPayload,
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Param('newsId', ParseIntPipe) newsId: number,
  ): Promise<void> {
    return this.newsService.delete({
      newsId,

      schoolId,
      userId: user.id,
    });
  }

  @ApiOperation({
    summary: '구독 중인 학교 소식 조회',
    description: '구독 중인 학교 소식을 조회합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.ACCESS_DENIED])
  @ApiBearerAuth('jwt')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get()
  async getSubscribedNews(
    @UserInfo() user: JwtPayload,
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Query() getSubscribedSchoolNewsRequestQueryDto: GetSubscribedSchoolNewsRequestQueryDto,
  ): Promise<GetSubscribedSchoolNewsResponseDto> {
    const result = await this.newsService.findSubscribedNews({
      schoolId,
      userId: user.id,
      page: getSubscribedSchoolNewsRequestQueryDto.page,
      pageSize: getSubscribedSchoolNewsRequestQueryDto.pageSize,
    });
    return new GetSubscribedSchoolNewsResponseDto(result);
  }
}
