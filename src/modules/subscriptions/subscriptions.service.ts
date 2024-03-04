import { BadRequestException, Injectable } from '@nestjs/common';

import {
  FindSubscribedInfoParam,
  FindSubscribedSchoolsParam,
  SubscribeToSchoolParam,
  UnsubscribeToSchoolParam,
} from './subscriptions.interface';
import { ERROR_CODE } from '../../common/filters/error.constant';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SchoolsService } from '../schools/schools.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly schoolsService: SchoolsService,
  ) {}

  /**
   * 학교 구독
   */
  async subscribeToSchool(subscribeToSchoolParam: SubscribeToSchoolParam) {
    const { schoolId, userId } = subscribeToSchoolParam;

    await this.schoolsService.findById({ schoolId });

    const subscribed = await this.prismaService.subscription.findFirst({
      where: {
        schoolId,
        userId,
      },
    });
    if (subscribed) {
      throw new BadRequestException(ERROR_CODE.SUBSCRIBED_ALREADY);
    }

    const subscribe = await this.prismaService.subscription.create({
      data: {
        schoolId,
        userId,
      },
    });

    return {
      subscriptionId: subscribe.id,
    };
  }

  /**
   * 학교 구독 취소
   */
  async unsubscribeFromSchool(unsubscribeToSchoolParam: UnsubscribeToSchoolParam): Promise<void> {
    const { schoolId, userId } = unsubscribeToSchoolParam;

    const subscribed = await this.prismaService.subscription.findFirst({
      where: {
        schoolId,
        userId,
      },
    });
    if (!subscribed) {
      throw new BadRequestException(ERROR_CODE.NOT_SUBSCRIBED);
    }

    await this.prismaService.subscription.deleteMany({
      where: {
        userId,
        schoolId,
      },
    });
  }

  /**
   * 구독 중인 학교 페이지 조회
   */
  async findSubscribedSchools(findSubscribedSchoolsParam: FindSubscribedSchoolsParam) {
    const { userId, page, pageSize } = findSubscribedSchoolsParam;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const subscriptions = await this.prismaService.subscription.findMany({
      include: {
        school: true,
      },
      where: {
        userId,
        school: {
          deletedAt: null,
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take,
    });

    return {
      list: subscriptions.map((subscription) => ({
        schoolId: subscription.schoolId,
        name: subscription.school.name,
        region: subscription.school.region,
        createdAt: subscription.school.createdAt,
        subscribedAt: subscription.createdAt,
      })),
    };
  }

  /** 구독 정보 확인 */
  async findSubscribedInfo(findSubscribedInfoParam: FindSubscribedInfoParam) {
    const { userId, schoolId } = findSubscribedInfoParam;
    const subscribed = await this.prismaService.subscription.findFirst({
      where: {
        userId,
        schoolId,
      },
    });
    if (!subscribed) {
      throw new BadRequestException(ERROR_CODE.NOT_SUBSCRIBED);
    }

    return subscribed;
  }
}
