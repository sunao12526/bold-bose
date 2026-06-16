"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpModule = void 0;
const common_1 = require("@nestjs/common");
const mp_account_service_1 = require("./account/mp-account.service");
const mp_account_controller_1 = require("./account/mp-account.controller");
const mp_material_service_1 = require("./material/mp-material.service");
const mp_material_controller_1 = require("./material/mp-material.controller");
const mp_menu_service_1 = require("./menu/mp-menu.service");
const mp_menu_controller_1 = require("./menu/mp-menu.controller");
const mp_auto_reply_service_1 = require("./auto-reply/mp-auto-reply.service");
const mp_auto_reply_controller_1 = require("./auto-reply/mp-auto-reply.controller");
const mp_user_service_1 = require("./user/mp-user.service");
const mp_user_controller_1 = require("./user/mp-user.controller");
const mp_tag_service_1 = require("./tag/mp-tag.service");
const mp_tag_controller_1 = require("./tag/mp-tag.controller");
const mp_message_service_1 = require("./message/mp-message.service");
const mp_message_controller_1 = require("./message/mp-message.controller");
let MpModule = class MpModule {
};
exports.MpModule = MpModule;
exports.MpModule = MpModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            mp_account_controller_1.MpAccountController,
            mp_material_controller_1.MpMaterialController,
            mp_menu_controller_1.MpMenuController,
            mp_auto_reply_controller_1.MpAutoReplyController,
            mp_user_controller_1.MpUserController,
            mp_tag_controller_1.MpTagController,
            mp_message_controller_1.MpMessageController,
        ],
        providers: [
            mp_account_service_1.MpAccountService,
            mp_material_service_1.MpMaterialService,
            mp_menu_service_1.MpMenuService,
            mp_auto_reply_service_1.MpAutoReplyService,
            mp_user_service_1.MpUserService,
            mp_tag_service_1.MpTagService,
            mp_message_service_1.MpMessageService,
        ],
        exports: [
            mp_account_service_1.MpAccountService,
            mp_material_service_1.MpMaterialService,
            mp_menu_service_1.MpMenuService,
            mp_auto_reply_service_1.MpAutoReplyService,
            mp_user_service_1.MpUserService,
            mp_tag_service_1.MpTagService,
            mp_message_service_1.MpMessageService,
        ],
    })
], MpModule);
//# sourceMappingURL=mp.module.js.map