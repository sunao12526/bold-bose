import { Module } from '@nestjs/common';
import { SocialClientController } from './social-client.controller';
import { SocialUserController } from './social-user.controller';
import { SocialService } from './social.service';

@Module({
  controllers: [SocialClientController, SocialUserController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
