import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SmsModule } from '../system/sms/sms.module';
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
import { AppMemberAuthService } from './app/app-member-auth.service';
import { MemberAuthGuard } from './app/member-auth.guard';
import { AppMemberAuthController } from './app/app-member-auth.controller';
import { AppMemberUserController } from './app/app-member-user.controller';
import { AppMemberAddressController } from './app/app-member-address.controller';
import { AppMemberSignInController } from './app/app-member-sign-in.controller';
import { AppMemberAssetsController } from './app/app-member-assets.controller';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error(
    'JWT_SECRET environment variable is required but not defined in .env',
  );
}

@Module({
  imports: [
    SmsModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any },
    }),
  ],
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
    AppMemberAuthController,
    AppMemberUserController,
    AppMemberAddressController,
    AppMemberSignInController,
    AppMemberAssetsController,
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
    AppMemberAuthService,
    MemberAuthGuard,
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
    AppMemberAuthService,
  ],
})
export class MemberModule {}
