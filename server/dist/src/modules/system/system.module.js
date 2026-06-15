"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const role_controller_1 = require("./role.controller");
const role_service_1 = require("./role.service");
const menu_controller_1 = require("./menu.controller");
const menu_service_1 = require("./menu.service");
const dict_type_controller_1 = require("./dict/dict-type.controller");
const dict_type_service_1 = require("./dict/dict-type.service");
const dict_data_controller_1 = require("./dict/dict-data.controller");
const dict_data_service_1 = require("./dict/dict-data.service");
const config_controller_1 = require("./config/config.controller");
const config_service_1 = require("./config/config.service");
const posts_module_1 = require("./posts/posts.module");
const dept_module_1 = require("./dept/dept.module");
const notice_module_1 = require("./notice/notice.module");
const sms_module_1 = require("./sms/sms.module");
const mail_module_1 = require("./mail/mail.module");
const oauth2_module_1 = require("./oauth2/oauth2.module");
const login_log_module_1 = require("./login-log/login-log.module");
const notify_service_1 = require("./notify/notify.service");
const notify_template_controller_1 = require("./notify/notify-template.controller");
const notify_message_controller_1 = require("./notify/notify-message.controller");
const user_session_service_1 = require("./session/user-session.service");
const user_session_controller_1 = require("./session/user-session.controller");
const profile_controller_1 = require("./profile.controller");
let SystemModule = class SystemModule {
};
exports.SystemModule = SystemModule;
exports.SystemModule = SystemModule = __decorate([
    (0, common_1.Module)({
        imports: [
            posts_module_1.PostsModule,
            dept_module_1.DeptModule,
            notice_module_1.NoticeModule,
            sms_module_1.SmsModule,
            mail_module_1.MailModule,
            oauth2_module_1.OAuth2Module,
            login_log_module_1.LoginLogModule,
        ],
        controllers: [
            user_controller_1.UserController,
            role_controller_1.RoleController,
            menu_controller_1.MenuController,
            dict_type_controller_1.DictTypeController,
            dict_data_controller_1.DictDataController,
            config_controller_1.ConfigController,
            notify_template_controller_1.NotifyTemplateController,
            notify_message_controller_1.NotifyMessageController,
            user_session_controller_1.UserSessionController,
            profile_controller_1.ProfileController,
        ],
        providers: [
            user_service_1.UserService,
            role_service_1.RoleService,
            menu_service_1.MenuService,
            dict_type_service_1.DictTypeService,
            dict_data_service_1.DictDataService,
            config_service_1.ConfigService,
            notify_service_1.NotifyService,
            user_session_service_1.UserSessionService,
        ],
        exports: [
            user_service_1.UserService,
            role_service_1.RoleService,
            menu_service_1.MenuService,
            dict_type_service_1.DictTypeService,
            dict_data_service_1.DictDataService,
            config_service_1.ConfigService,
            notify_service_1.NotifyService,
            user_session_service_1.UserSessionService,
        ],
    })
], SystemModule);
//# sourceMappingURL=system.module.js.map