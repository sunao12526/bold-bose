-- CreateEnum
CREATE TYPE "MallCouponType" AS ENUM ('CASH', 'DISCOUNT');

-- CreateEnum
CREATE TYPE "MallCouponScopeType" AS ENUM ('ALL', 'CATEGORY', 'SPU');

-- CreateEnum
CREATE TYPE "MallCouponValidityType" AS ENUM ('DATE', 'TERM');

-- CreateEnum
CREATE TYPE "MallCouponUserStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "mall_coupons" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "MallCouponType" NOT NULL DEFAULT 'CASH',
    "min_price" INTEGER NOT NULL DEFAULT 0,
    "value" INTEGER NOT NULL,
    "total_count" INTEGER NOT NULL DEFAULT 0,
    "take_count" INTEGER NOT NULL DEFAULT 0,
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "scope_type" "MallCouponScopeType" NOT NULL DEFAULT 'ALL',
    "scope_value" JSONB,
    "validity_type" "MallCouponValidityType" NOT NULL DEFAULT 'DATE',
    "valid_start_time" TIMESTAMP(3),
    "valid_end_time" TIMESTAMP(3),
    "valid_days" INTEGER,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_coupon_users" (
    "id" SERIAL NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "status" "MallCouponUserStatus" NOT NULL DEFAULT 'UNUSED',
    "use_order_id" INTEGER,
    "valid_start_time" TIMESTAMP(3) NOT NULL,
    "valid_end_time" TIMESTAMP(3) NOT NULL,
    "use_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_coupon_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mall_coupon_users" ADD CONSTRAINT "mall_coupon_users_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "mall_coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mall_coupon_users" ADD CONSTRAINT "mall_coupon_users_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
