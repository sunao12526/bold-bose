"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsModule = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category/category.service");
const category_controller_1 = require("./category/category.controller");
const article_service_1 = require("./article/article.service");
const article_controller_1 = require("./article/article.controller");
const tag_service_1 = require("./tag/tag.service");
const tag_controller_1 = require("./tag/tag.controller");
const comment_service_1 = require("./comment/comment.service");
const comment_controller_1 = require("./comment/comment.controller");
const banner_service_1 = require("./banner/banner.service");
const banner_controller_1 = require("./banner/banner.controller");
let CmsModule = class CmsModule {
};
exports.CmsModule = CmsModule;
exports.CmsModule = CmsModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            category_controller_1.CategoryController,
            article_controller_1.ArticleController,
            tag_controller_1.TagController,
            comment_controller_1.CommentController,
            banner_controller_1.BannerController,
        ],
        providers: [
            category_service_1.CategoryService,
            article_service_1.ArticleService,
            tag_service_1.TagService,
            comment_service_1.CommentService,
            banner_service_1.BannerService,
        ],
        exports: [
            category_service_1.CategoryService,
            article_service_1.ArticleService,
            tag_service_1.TagService,
            comment_service_1.CommentService,
            banner_service_1.BannerService,
        ],
    })
], CmsModule);
//# sourceMappingURL=cms.module.js.map