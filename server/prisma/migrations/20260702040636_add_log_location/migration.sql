/*
  Warnings:

  - You are about to drop the column `content` on the `system_posts` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `system_posts` table. All the data in the column will be lost.
  - The `status` column on the `system_posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `code` to the `system_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `system_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sort` to the `system_posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CmsArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CmsCommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "member_users" ADD COLUMN     "group_id" INTEGER;

-- AlterTable
ALTER TABLE "system_operation_logs" ADD COLUMN     "location" VARCHAR(100);

-- AlterTable
ALTER TABLE "system_posts" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "code" VARCHAR(100) NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "remark" VARCHAR(500),
ADD COLUMN     "sort" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE';

-- AlterTable
ALTER TABLE "system_users" ADD COLUMN     "avatar" VARCHAR(512),
ADD COLUMN     "dept_id" INTEGER;

-- CreateTable
CREATE TABLE "system_dept" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "parent_id" INTEGER NOT NULL DEFAULT 0,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "leader_id" INTEGER,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_dept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notice" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "type" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_sms_channel" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "api_key" VARCHAR(100) NOT NULL,
    "api_secret" VARCHAR(100) NOT NULL,
    "signature" VARCHAR(50) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_sms_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_sms_template" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_sms_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_sms_log" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "error_message" VARCHAR(500),
    "send_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_sms_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_mail_account" (
    "id" SERIAL NOT NULL,
    "mail" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "host" VARCHAR(100) NOT NULL,
    "port" INTEGER NOT NULL,
    "ssl" BOOLEAN NOT NULL DEFAULT false,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_mail_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_mail_template" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_mail_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_mail_log" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "receiver" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "error_message" VARCHAR(500),
    "send_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_mail_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_social_user" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "openid" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(100),
    "avatar" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_social_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_oauth2_client" (
    "id" SERIAL NOT NULL,
    "client_id" VARCHAR(100) NOT NULL,
    "secret" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "logo" VARCHAR(200),
    "redirect_uris" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_oauth2_client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_login_log" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "ip" VARCHAR(50) NOT NULL,
    "location" VARCHAR(100),
    "user_agent" VARCHAR(500) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "message" VARCHAR(200),
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_login_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_post" (
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "system_user_post_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "system_sms_codes" (
    "id" SERIAL NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "scene" INTEGER NOT NULL,
    "today_index" INTEGER NOT NULL DEFAULT 1,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "used_ip" VARCHAR(50),
    "used_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_sms_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_social_clients" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "client_id" VARCHAR(100) NOT NULL,
    "client_secret" VARCHAR(100) NOT NULL,
    "redirect_uri" VARCHAR(200) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_social_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_article" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT,
    "summary" VARCHAR(500),
    "cover_url" VARCHAR(500),
    "author" VARCHAR(50) NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "CmsArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "is_top" BOOLEAN NOT NULL DEFAULT false,
    "is_recommend" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_article_tag" (
    "article_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "cms_article_tag_pkey" PRIMARY KEY ("article_id","tag_id")
);

-- CreateTable
CREATE TABLE "cms_comment" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "nickname" VARCHAR(50) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "status" "CmsCommentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_banner" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "pic_url" VARCHAR(500) NOT NULL,
    "url" VARCHAR(500),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_account" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "account" VARCHAR(100) NOT NULL,
    "app_id" VARCHAR(100) NOT NULL,
    "app_secret" VARCHAR(200) NOT NULL,
    "token" VARCHAR(100) NOT NULL,
    "aes_key" VARCHAR(200),
    "qr_code_url" VARCHAR(500),
    "remark" VARCHAR(500),
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mp_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_material" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "app_id" VARCHAR(100) NOT NULL,
    "media_id" VARCHAR(200) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "permanent" BOOLEAN NOT NULL DEFAULT true,
    "url" VARCHAR(500) NOT NULL,
    "name" VARCHAR(200),
    "mp_url" VARCHAR(500),
    "title" VARCHAR(200),
    "introduction" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mp_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_menu" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "app_id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "menu_key" VARCHAR(100),
    "parent_id" INTEGER DEFAULT 0,
    "type" VARCHAR(30),
    "url" VARCHAR(500),
    "mini_program_app_id" VARCHAR(100),
    "mini_program_page_path" VARCHAR(200),
    "reply_message_type" VARCHAR(30),
    "reply_content" TEXT,
    "reply_media_id" VARCHAR(200),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mp_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_auto_reply" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "app_id" VARCHAR(100) NOT NULL,
    "type" INTEGER NOT NULL,
    "request_keyword" VARCHAR(200),
    "request_match" INTEGER DEFAULT 1,
    "request_message_type" VARCHAR(30),
    "response_message_type" VARCHAR(30) NOT NULL,
    "response_content" TEXT,
    "response_media_id" VARCHAR(200),
    "response_media_url" VARCHAR(500),
    "response_articles" JSONB,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mp_auto_reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_user" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "app_id" VARCHAR(100) NOT NULL,
    "openid" VARCHAR(100) NOT NULL,
    "unionid" VARCHAR(100),
    "subscribe_status" INTEGER NOT NULL DEFAULT 1,
    "subscribe_time" TIMESTAMP(3),
    "unsubscribe_time" TIMESTAMP(3),
    "nickname" VARCHAR(100),
    "head_image_url" VARCHAR(500),
    "language" VARCHAR(20),
    "country" VARCHAR(50),
    "province" VARCHAR(50),
    "city" VARCHAR(50),
    "remark" VARCHAR(500),
    "tag_ids" JSONB,
    "sex" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mp_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_tag" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "app_id" VARCHAR(100) NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mp_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_message" (
    "id" SERIAL NOT NULL,
    "msg_id" BIGINT,
    "account_id" INTEGER NOT NULL,
    "app_id" VARCHAR(100) NOT NULL,
    "user_id" INTEGER,
    "openid" VARCHAR(100) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "send_from" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT,
    "media_id" VARCHAR(200),
    "media_url" VARCHAR(500),
    "title" VARCHAR(200),
    "url" VARCHAR(500),
    "event" VARCHAR(30),
    "event_key" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mp_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_point_records" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "biz_type" VARCHAR(50) NOT NULL,
    "biz_id" VARCHAR(100),
    "point" INTEGER NOT NULL,
    "after_point" INTEGER NOT NULL,
    "operator_id" VARCHAR(50),
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_point_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_balance_records" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "biz_type" VARCHAR(50) NOT NULL,
    "biz_id" VARCHAR(100),
    "balance" INTEGER NOT NULL,
    "after_balance" INTEGER NOT NULL,
    "operator_id" VARCHAR(50),
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_balance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_addresses" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "area_id" INTEGER,
    "detail_address" VARCHAR(512) NOT NULL,
    "default_status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_configs" (
    "id" SERIAL NOT NULL,
    "trade_point_cash_percent" INTEGER NOT NULL DEFAULT 0,
    "trade_point_give_percent" INTEGER NOT NULL DEFAULT 0,
    "sign_in_point" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_experience_records" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "experience" INTEGER NOT NULL,
    "after_experience" INTEGER NOT NULL,
    "biz_type" VARCHAR(50) NOT NULL,
    "biz_id" VARCHAR(100),
    "operator_id" VARCHAR(50),
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_experience_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_level_records" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "old_level_id" INTEGER,
    "new_level_id" INTEGER,
    "old_level_name" VARCHAR(50),
    "new_level_name" VARCHAR(50),
    "experience" INTEGER NOT NULL,
    "operator_id" VARCHAR(50),
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_level_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_sms_template_code_key" ON "system_sms_template"("code");

-- CreateIndex
CREATE UNIQUE INDEX "system_mail_template_code_key" ON "system_mail_template"("code");

-- CreateIndex
CREATE UNIQUE INDEX "system_social_user_type_openid_key" ON "system_social_user"("type", "openid");

-- CreateIndex
CREATE UNIQUE INDEX "system_oauth2_client_client_id_key" ON "system_oauth2_client"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_social_clients_type_key" ON "system_social_clients"("type");

-- CreateIndex
CREATE UNIQUE INDEX "cms_category_code_key" ON "cms_category"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cms_tag_name_key" ON "cms_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mp_account_app_id_key" ON "mp_account"("app_id");

-- CreateIndex
CREATE UNIQUE INDEX "mp_user_account_id_openid_key" ON "mp_user"("account_id", "openid");

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "system_dept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_users" ADD CONSTRAINT "member_users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "member_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dept" ADD CONSTRAINT "system_dept_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "system_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_sms_template" ADD CONSTRAINT "system_sms_template_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "system_sms_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_sms_log" ADD CONSTRAINT "system_sms_log_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "system_sms_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_mail_template" ADD CONSTRAINT "system_mail_template_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "system_mail_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_mail_log" ADD CONSTRAINT "system_mail_log_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "system_mail_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_social_user" ADD CONSTRAINT "system_social_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_post" ADD CONSTRAINT "system_user_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_post" ADD CONSTRAINT "system_user_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "system_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_article" ADD CONSTRAINT "cms_article_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "cms_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_article_tag" ADD CONSTRAINT "cms_article_tag_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "cms_article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_article_tag" ADD CONSTRAINT "cms_article_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "cms_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_comment" ADD CONSTRAINT "cms_comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "cms_article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mp_material" ADD CONSTRAINT "mp_material_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "mp_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mp_menu" ADD CONSTRAINT "mp_menu_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "mp_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mp_auto_reply" ADD CONSTRAINT "mp_auto_reply_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "mp_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mp_user" ADD CONSTRAINT "mp_user_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "mp_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mp_tag" ADD CONSTRAINT "mp_tag_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "mp_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mp_message" ADD CONSTRAINT "mp_message_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "mp_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_point_records" ADD CONSTRAINT "member_point_records_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_balance_records" ADD CONSTRAINT "member_balance_records_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_addresses" ADD CONSTRAINT "member_addresses_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_experience_records" ADD CONSTRAINT "member_experience_records_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_level_records" ADD CONSTRAINT "member_level_records_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
