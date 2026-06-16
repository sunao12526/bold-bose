import { Module } from '@nestjs/common';
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

@Module({
  controllers: [
    MpAccountController,
    MpMaterialController,
    MpMenuController,
    MpAutoReplyController,
    MpUserController,
    MpTagController,
    MpMessageController,
  ],
  providers: [
    MpAccountService,
    MpMaterialService,
    MpMenuService,
    MpAutoReplyService,
    MpUserService,
    MpTagService,
    MpMessageService,
  ],
  exports: [
    MpAccountService,
    MpMaterialService,
    MpMenuService,
    MpAutoReplyService,
    MpUserService,
    MpTagService,
    MpMessageService,
  ],
})
export class MpModule {}
