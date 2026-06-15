import { Module } from '@nestjs/common';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { ArticleService } from './article/article.service';
import { ArticleController } from './article/article.controller';
import { TagService } from './tag/tag.service';
import { TagController } from './tag/tag.controller';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { BannerService } from './banner/banner.service';
import { BannerController } from './banner/banner.controller';

@Module({
  controllers: [
    CategoryController,
    ArticleController,
    TagController,
    CommentController,
    BannerController,
  ],
  providers: [
    CategoryService,
    ArticleService,
    TagService,
    CommentService,
    BannerService,
  ],
  exports: [
    CategoryService,
    ArticleService,
    TagService,
    CommentService,
    BannerService,
  ],
})
export class CmsModule {}
