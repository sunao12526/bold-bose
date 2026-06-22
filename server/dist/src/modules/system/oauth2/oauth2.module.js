"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Module = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const oauth2_service_1 = require("./oauth2.service");
const oauth2_client_controller_1 = require("./oauth2-client.controller");
const oauth2_controller_1 = require("./oauth2.controller");
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required but not defined in .env');
}
let OAuth2Module = class OAuth2Module {
};
exports.OAuth2Module = OAuth2Module;
exports.OAuth2Module = OAuth2Module = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: jwtSecret,
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [oauth2_client_controller_1.OAuth2ClientController, oauth2_controller_1.OAuth2Controller],
        providers: [oauth2_service_1.OAuth2Service],
        exports: [oauth2_service_1.OAuth2Service],
    })
], OAuth2Module);
//# sourceMappingURL=oauth2.module.js.map