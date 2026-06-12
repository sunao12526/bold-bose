-- CreateEnum
CREATE TYPE "PayOrderStatus" AS ENUM ('UNPAID', 'SUCCESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "PayRefundStatus" AS ENUM ('APPLY', 'SUCCESS', 'CLOSED', 'FAIL');

-- CreateEnum
CREATE TYPE "PayNotifyStatus" AS ENUM ('NO', 'SUCCESS', 'FAIL');

-- CreateEnum
CREATE TYPE "PayNotifyType" AS ENUM ('ORDER', 'REFUND');

-- CreateTable
CREATE TABLE "pay_apps" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(512),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pay_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pay_channels" (
    "id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "config" JSONB NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(512),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pay_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pay_orders" (
    "id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "merchant_order_id" VARCHAR(64) NOT NULL,
    "subject" VARCHAR(128) NOT NULL,
    "price" INTEGER NOT NULL,
    "channel_code" VARCHAR(32),
    "status" "PayOrderStatus" NOT NULL DEFAULT 'UNPAID',
    "pay_time" TIMESTAMP(3),
    "expire_at" TIMESTAMP(3) NOT NULL,
    "merchant_notify_url" VARCHAR(512) NOT NULL,
    "notifyStatus" "PayNotifyStatus" NOT NULL DEFAULT 'NO',

    CONSTRAINT "pay_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pay_refunds" (
    "id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "pay_order_id" INTEGER NOT NULL,
    "merchant_refund_id" VARCHAR(64) NOT NULL,
    "price" INTEGER NOT NULL,
    "refund_price" INTEGER NOT NULL,
    "status" "PayRefundStatus" NOT NULL DEFAULT 'APPLY',
    "reason" VARCHAR(200) NOT NULL,
    "refund_time" TIMESTAMP(3),
    "merchant_notify_url" VARCHAR(512) NOT NULL,
    "notifyStatus" "PayNotifyStatus" NOT NULL DEFAULT 'NO',

    CONSTRAINT "pay_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pay_notify_logs" (
    "id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "pay_order_id" INTEGER,
    "refund_id" INTEGER,
    "type" "PayNotifyType" NOT NULL,
    "status" "PayNotifyStatus" NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_time" TIMESTAMP(3),
    "next_notify_time" TIMESTAMP(3),
    "response_content" VARCHAR(2000),

    CONSTRAINT "pay_notify_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pay_apps_code_key" ON "pay_apps"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pay_channels_app_id_code_key" ON "pay_channels"("app_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "pay_orders_app_id_merchant_order_id_key" ON "pay_orders"("app_id", "merchant_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "pay_refunds_app_id_merchant_refund_id_key" ON "pay_refunds"("app_id", "merchant_refund_id");

-- AddForeignKey
ALTER TABLE "pay_channels" ADD CONSTRAINT "pay_channels_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "pay_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pay_orders" ADD CONSTRAINT "pay_orders_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "pay_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pay_refunds" ADD CONSTRAINT "pay_refunds_pay_order_id_fkey" FOREIGN KEY ("pay_order_id") REFERENCES "pay_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pay_notify_logs" ADD CONSTRAINT "pay_notify_logs_pay_order_id_fkey" FOREIGN KEY ("pay_order_id") REFERENCES "pay_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pay_notify_logs" ADD CONSTRAINT "pay_notify_logs_refund_id_fkey" FOREIGN KEY ("refund_id") REFERENCES "pay_refunds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
