import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { SignInService } from './sign-in.service';
import { SignInController } from './sign-in.controller';

@Module({
  controllers: [
    MemberController,
    LevelController,
    TagController,
    SignInController,
  ],
  providers: [
    MemberService,
    LevelService,
    TagService,
    SignInService,
  ],
  exports: [
    MemberService,
    LevelService,
    TagService,
    SignInService,
  ],
})
export class MemberModule {}
