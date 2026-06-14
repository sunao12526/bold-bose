import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { DictTypeController } from './dict/dict-type.controller';
import { DictTypeService } from './dict/dict-type.service';
import { DictDataController } from './dict/dict-data.controller';
import { DictDataService } from './dict/dict-data.service';
import { ConfigController } from './config/config.controller';
import { ConfigService } from './config/config.service';
import { PostsModule } from './posts/posts.module';
import { DeptModule } from './dept/dept.module';
import { NoticeModule } from './notice/notice.module';
import { SmsModule } from './sms/sms.module';
import { MailModule } from './mail/mail.module';
import { OAuth2Module } from './oauth2/oauth2.module';
import { LoginLogModule } from './login-log/login-log.module';
import { NotifyService } from './notify/notify.service';
import { NotifyTemplateController } from './notify/notify-template.controller';
import { NotifyMessageController } from './notify/notify-message.controller';
import { UserSessionService } from './session/user-session.service';
import { UserSessionController } from './session/user-session.controller';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    PostsModule,
    DeptModule,
    NoticeModule,
    SmsModule,
    MailModule,
    OAuth2Module,
    LoginLogModule
  ],
  controllers: [
    UserController, 
    RoleController, 
    MenuController,
    DictTypeController,
    DictDataController,
    ConfigController,
    NotifyTemplateController,
    NotifyMessageController,
    UserSessionController,
    ProfileController
  ],
  providers: [
    UserService, 
    RoleService, 
    MenuService,
    DictTypeService,
    DictDataService,
    ConfigService,
    NotifyService,
    UserSessionService
  ],
  exports: [
    UserService, 
    RoleService, 
    MenuService,
    DictTypeService,
    DictDataService,
    ConfigService,
    NotifyService,
    UserSessionService
  ],
})
export class SystemModule {}
