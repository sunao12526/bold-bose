-- CreateEnum
CREATE TYPE "MallOrderStatus" AS ENUM ('UNPAID', 'UNDELIVERED', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MallRefundStatus" AS ENUM ('NONE', 'APPLY', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "member_users" (
    "id" SERIAL NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "avatar" VARCHAR(512),
    "mobile" VARCHAR(20) NOT NULL,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "points" INTEGER NOT NULL DEFAULT 0,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_orders" (
    "id" SERIAL NOT NULL,
    "no" VARCHAR(100) NOT NULL,
    "member_id" INTEGER NOT NULL,
    "status" "MallOrderStatus" NOT NULL DEFAULT 'UNPAID',
    "pay_price" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "discount_price" INTEGER NOT NULL DEFAULT 0,
    "delivery_status" BOOLEAN NOT NULL DEFAULT false,
    "logistics_co" VARCHAR(100),
    "logistics_no" VARCHAR(100),
    "receiver_name" VARCHAR(50) NOT NULL,
    "receiver_mobile" VARCHAR(20) NOT NULL,
    "receiver_address" VARCHAR(512) NOT NULL,
    "user_remark" VARCHAR(500),
    "pay_time" TIMESTAMP(3),
    "delivery_time" TIMESTAMP(3),
    "receive_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "spu_id" INTEGER NOT NULL,
    "sku_id" INTEGER NOT NULL,
    "spu_name" VARCHAR(200) NOT NULL,
    "pic_url" VARCHAR(512) NOT NULL,
    "properties" JSONB NOT NULL,
    "price" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "mall_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_order_refunds" (
    "id" SERIAL NOT NULL,
    "no" VARCHAR(100) NOT NULL,
    "order_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "refund_price" INTEGER NOT NULL,
    "status" "MallRefundStatus" NOT NULL DEFAULT 'APPLY',
    "reason" VARCHAR(200) NOT NULL,
    "user_remark" VARCHAR(500),
    "audit_remark" VARCHAR(500),
    "audit_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_order_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_users_mobile_key" ON "member_users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "mall_orders_no_key" ON "mall_orders"("no");

-- CreateIndex
CREATE UNIQUE INDEX "mall_order_refunds_no_key" ON "mall_order_refunds"("no");

-- AddForeignKey
ALTER TABLE "mall_orders" ADD CONSTRAINT "mall_orders_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mall_order_items" ADD CONSTRAINT "mall_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "mall_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mall_order_refunds" ADD CONSTRAINT "mall_order_refunds_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "mall_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
