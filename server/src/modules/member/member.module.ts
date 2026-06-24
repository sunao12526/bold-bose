import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { SignInService } from './sign-in.service';
import { SignInController } from './sign-in.controller';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PointRecordService } from './point-record.service';
import { PointRecordController } from './point-record.controller';
import { BalanceRecordService } from './balance-record.service';
import { BalanceRecordController } from './balance-record.controller';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { ExperienceRecordService } from './experience-record.service';
import { ExperienceRecordController } from './experience-record.controller';
import { LevelRecordService } from './level-record.service';
import { LevelRecordController } from './level-record.controller';

@Module({
  controllers: [
    MemberController,
    LevelController,
    TagController,
    SignInController,
    GroupController,
    PointRecordController,
    BalanceRecordController,
    AddressController,
    ConfigController,
    ExperienceRecordController,
    LevelRecordController,
  ],
  providers: [
    MemberService,
    LevelService,
    TagService,
    SignInService,
    GroupService,
    PointRecordService,
    BalanceRecordService,
    AddressService,
    ConfigService,
    ExperienceRecordService,
    LevelRecordService,
  ],
  exports: [
    MemberService,
    LevelService,
    TagService,
    SignInService,
    GroupService,
    PointRecordService,
    BalanceRecordService,
    AddressService,
    ConfigService,
    ExperienceRecordService,
    LevelRecordService,
  ],
})
export class MemberModule {}
