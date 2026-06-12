-- CreateTable
CREATE TABLE "system_posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT,
    "status" VARCHAR(20) DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_jobs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "handler_name" VARCHAR(100) NOT NULL,
    "cron_expression" VARCHAR(100) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infra_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_job_logs" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "handler_name" VARCHAR(100) NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "error_message" VARCHAR(2000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infra_job_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "infra_job_logs" ADD CONSTRAINT "infra_job_logs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "infra_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
