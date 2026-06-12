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
import { NotifyService } from './notify/notify.service';
import { NotifyTemplateController } from './notify/notify-template.controller';
import { NotifyMessageController } from './notify/notify-message.controller';

@Module({
  imports: [PostsModule],
  controllers: [
    UserController, 
    RoleController, 
    MenuController,
    DictTypeController,
    DictDataController,
    ConfigController,
    NotifyTemplateController,
    NotifyMessageController
  ],
  providers: [
    UserService, 
    RoleService, 
    MenuService,
    DictTypeService,
    DictDataService,
    ConfigService,
    NotifyService
  ],
  exports: [
    UserService, 
    RoleService, 
    MenuService,
    DictTypeService,
    DictDataService,
    ConfigService,
    NotifyService
  ],
})
export class SystemModule {}
