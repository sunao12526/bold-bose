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

@Module({
  controllers: [
    UserController, 
    RoleController, 
    MenuController,
    DictTypeController,
    DictDataController,
    ConfigController
  ],
  providers: [
    UserService, 
    RoleService, 
    MenuService,
    DictTypeService,
    DictDataService,
    ConfigService
  ],
  exports: [
    UserService, 
    RoleService, 
    MenuService,
    DictTypeService,
    DictDataService,
    ConfigService
  ],
})
export class SystemModule {}
