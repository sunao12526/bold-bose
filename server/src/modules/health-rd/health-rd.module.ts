import { Module } from '@nestjs/common';
import { HealthRdService } from './health-rd.service';
import { HealthRdController } from './health-rd.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthRdController],
  providers: [HealthRdService],
  exports: [HealthRdService],
})
export class HealthRdModule {}
