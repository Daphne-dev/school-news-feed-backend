import { Module } from '@nestjs/common';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { JwtUtilityModule } from '../../common/jwt/jwt-utility.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SchoolModule } from '../schools/schools.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtUtilityModule, PrismaModule, UserModule, SchoolModule, SubscriptionsModule],
  providers: [NewsService],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {}
