import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';

import { CreateNewsParam, DeleteNewsParam, FindSubscribedNewsParam, UpdateNewsParam } from './news.interface';
import { ERROR_CODE } from '../../common/filters/error.constant';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SchoolsService } from '../schools/schools.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly schoolsService: SchoolsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  /**
   * 학교 소식 생성
   */
  async create(createNewsParam: CreateNewsParam) {
    const { title, content, schoolId, userId } = createNewsParam;

    const isSchoolAdmin = await this.schoolsService.isSchoolAdmin({ schoolId, userId });
    if (!isSchoolAdmin) {
      throw new ForbiddenException(ERROR_CODE.ACCESS_DENIED);
    }

    const news = await this.prismaService.news.create({
      data: {
        title,
        content,
        schoolId,
      },
    });

    return {
      newsId: news.id,
    };
  }

  /**
   * 학교 소식 수정
   */
  async update(updateNewsParam: UpdateNewsParam) {
    const { newsId, title, content, schoolId, userId } = updateNewsParam;

    const isSchoolAdmin = await this.schoolsService.isSchoolAdmin({ schoolId, userId });
    if (!isSchoolAdmin) {
      throw new ForbiddenException(ERROR_CODE.ACCESS_DENIED);
    }

    const news = await this.prismaService.news.findUnique({
      where: {
        id: newsId,
      },
    });
    if (!news) {
      throw new NotFoundException(ERROR_CODE.SCHOOL_NEWS_NOT_FOUND);
    }

    await this.prismaService.news.update({
      where: {
        id: newsId,
      },
      data: {
        title,
        content,
        schoolId,
      },
    });

    return {
      newsId: news.id,
    };
  }

  /**
   * 학교 소식 삭제
   */
  async delete(deleteNewsParam: DeleteNewsParam) {
    const { newsId, schoolId, userId } = deleteNewsParam;

    const isSchoolAdmin = await this.schoolsService.isSchoolAdmin({ schoolId, userId });
    if (!isSchoolAdmin) {
      throw new ForbiddenException(ERROR_CODE.ACCESS_DENIED);
    }

    const news = await this.prismaService.news.findUnique({
      where: {
        id: newsId,
      },
    });
    if (!news) {
      throw new NotFoundException(ERROR_CODE.SCHOOL_NEWS_NOT_FOUND);
    }

    await this.prismaService.news.update({
      where: {
        id: newsId,
      },
      data: {
        deletedAt: dayjs().toISOString(),
      },
    });
  }

  /**
   * 구독 중인 학교 페이지의 소식 조회
   */
  async findSubscribedNews(findSubscribedNewsParam: FindSubscribedNewsParam) {
    const { schoolId, userId, page, pageSize } = findSubscribedNewsParam;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const subscribed = await this.subscriptionsService.findSubscribedInfo({ schoolId, userId });

    const news = await this.prismaService.news.findMany({
      where: {
        schoolId: subscribed.schoolId,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      list: news.map((newsInfo) => ({
        newsId: newsInfo.id,
        title: newsInfo.title,
        content: newsInfo.content,
        createdAt: newsInfo.createdAt,
      })),
    };
  }
}
