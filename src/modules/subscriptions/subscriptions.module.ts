import { Module } from '@nestjs/common';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { JwtUtilityModule } from '../../common/jwt/jwt-utility.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SchoolModule } from '../schools/schools.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtUtilityModule, PrismaModule, SchoolModule, UserModule],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
