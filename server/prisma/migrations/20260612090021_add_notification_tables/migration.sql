-- CreateTable
CREATE TABLE "system_notify_templates" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_notify_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notify_messages" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "template_code" VARCHAR(100) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "read_time" TIMESTAMP(3),
    "status" INTEGER NOT NULL,
    "error_message" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_notify_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_notify_templates_code_key" ON "system_notify_templates"("code");

-- AddForeignKey
ALTER TABLE "system_notify_messages" ADD CONSTRAINT "system_notify_messages_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "system_notify_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
