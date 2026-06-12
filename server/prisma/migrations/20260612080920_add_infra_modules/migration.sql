-- CreateEnum
CREATE TYPE "FileStorageType" AS ENUM ('LOCAL', 'S3');

-- CreateTable
CREATE TABLE "infra_file_configs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "storage" "FileStorageType" NOT NULL DEFAULT 'LOCAL',
    "config" JSONB NOT NULL,
    "master" BOOLEAN NOT NULL DEFAULT false,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infra_file_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_files" (
    "id" SERIAL NOT NULL,
    "config_id" INTEGER NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "path" VARCHAR(512) NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "type" VARCHAR(100),
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infra_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dict_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_dict_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dict_data" (
    "id" SERIAL NOT NULL,
    "dict_type" VARCHAR(100) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "color_type" VARCHAR(50),
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_dict_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(500) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_operation_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "username" VARCHAR(50),
    "module" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "path" VARCHAR(200) NOT NULL,
    "method" VARCHAR(10) NOT NULL,
    "ip" VARCHAR(50) NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_operation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_dict_types_type_key" ON "system_dict_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs"("key");

-- AddForeignKey
ALTER TABLE "infra_files" ADD CONSTRAINT "infra_files_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "infra_file_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dict_data" ADD CONSTRAINT "system_dict_data_dict_type_fkey" FOREIGN KEY ("dict_type") REFERENCES "system_dict_types"("type") ON DELETE CASCADE ON UPDATE CASCADE;
