"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberModule = void 0;
const common_1 = require("@nestjs/common");
const member_service_1 = require("./member.service");
const member_controller_1 = require("./member.controller");
const level_service_1 = require("./level.service");
const level_controller_1 = require("./level.controller");
const tag_service_1 = require("./tag.service");
const tag_controller_1 = require("./tag.controller");
const sign_in_service_1 = require("./sign-in.service");
const sign_in_controller_1 = require("./sign-in.controller");
let MemberModule = class MemberModule {
};
exports.MemberModule = MemberModule;
exports.MemberModule = MemberModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            member_controller_1.MemberController,
            level_controller_1.LevelController,
            tag_controller_1.TagController,
            sign_in_controller_1.SignInController,
        ],
        providers: [
            member_service_1.MemberService,
            level_service_1.LevelService,
            tag_service_1.TagService,
            sign_in_service_1.SignInService,
        ],
        exports: [
            member_service_1.MemberService,
            level_service_1.LevelService,
            tag_service_1.TagService,
            sign_in_service_1.SignInService,
        ],
    })
], MemberModule);
//# sourceMappingURL=member.module.js.map