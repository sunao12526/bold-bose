-- AlterTable
ALTER TABLE "member_users" ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level_id" INTEGER,
ADD COLUMN     "tag_ids" JSONB;

-- CreateTable
CREATE TABLE "member_levels" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "level" INTEGER NOT NULL,
    "experience" INTEGER NOT NULL,
    "discount_percent" INTEGER NOT NULL DEFAULT 100,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_sign_in_configs" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_sign_in_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_sign_in_records" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_sign_in_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_levels_level_key" ON "member_levels"("level");

-- CreateIndex
CREATE UNIQUE INDEX "member_tags_name_key" ON "member_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "member_sign_in_configs_day_key" ON "member_sign_in_configs"("day");

-- AddForeignKey
ALTER TABLE "member_users" ADD CONSTRAINT "member_users_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "member_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_sign_in_records" ADD CONSTRAINT "member_sign_in_records_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
