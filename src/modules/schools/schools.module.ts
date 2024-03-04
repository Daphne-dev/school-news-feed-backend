import { Module } from '@nestjs/common';

import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { JwtUtilityModule } from '../../common/jwt/jwt-utility.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtUtilityModule, PrismaModule, UserModule],
  providers: [SchoolsService],
  controllers: [SchoolsController],
  exports: [SchoolsService],
})
export class SchoolModule {}
