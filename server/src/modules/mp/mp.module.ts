import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MpAccountService } from './account/mp-account.service';
import { MpAccountController } from './account/mp-account.controller';
import { MpMaterialService } from './material/mp-material.service';
import { MpMaterialController } from './material/mp-material.controller';
import { MpMenuService } from './menu/mp-menu.service';
import { MpMenuController } from './menu/mp-menu.controller';
import { MpAutoReplyService } from './auto-reply/mp-auto-reply.service';
import { MpAutoReplyController } from './auto-reply/mp-auto-reply.controller';
import { MpUserService } from './user/mp-user.service';
import { MpUserController } from './user/mp-user.controller';
import { MpTagService } from './tag/mp-tag.service';
import { MpTagController } from './tag/mp-tag.controller';
import { MpMessageService } from './message/mp-message.service';
import { MpMessageController } from './message/mp-message.controller';
import { MpClientService } from './shared/mp-client.service';
import { MpOpenController } from './open/mp-open.controller';
import { MpMessageTemplateService } from './message/mp-message-template.service';
import { MpMessageTemplateController } from './message/mp-message-template.controller';
import { MpDraftController } from './news/mp-draft.controller';
import { MpFreePublishController } from './news/mp-free-publish.controller';
import { MpStatisticsController } from './statistics/mp-statistics.controller';

@Module({
  imports: [
    CacheModule.register(),
  ],
  controllers: [
    MpOpenController,
    MpAccountController,
    MpMaterialController,
    MpMenuController,
    MpAutoReplyController,
    MpUserController,
    MpTagController,
    MpMessageController,
    MpMessageTemplateController,
    MpDraftController,
    MpFreePublishController,
    MpStatisticsController,
  ],
  providers: [
    MpClientService,
    MpAccountService,
    MpMaterialService,
    MpMenuService,
    MpAutoReplyService,
    MpUserService,
    MpTagService,
    MpMessageService,
    MpMessageTemplateService,
  ],
  exports: [
    MpClientService,
    MpAccountService,
    MpMaterialService,
    MpMenuService,
    MpAutoReplyService,
    MpUserService,
    MpTagService,
    MpMessageService,
    MpMessageTemplateService,
  ],
})
export class MpModule {}
