-- CreateTable
CREATE TABLE "mall_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "parent_id" INTEGER,
    "pic_url" VARCHAR(512),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_brands" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "logo" VARCHAR(512),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_properties" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_property_values" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_property_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_spus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "brand_id" INTEGER,
    "pic_url" VARCHAR(512) NOT NULL,
    "slider_pic_urls" JSONB NOT NULL,
    "description" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ENABLE',
    "sales_count" INTEGER NOT NULL DEFAULT 0,
    "min_price" INTEGER NOT NULL DEFAULT 0,
    "max_price" INTEGER NOT NULL DEFAULT 0,
    "total_stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_spus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_skus" (
    "id" SERIAL NOT NULL,
    "spu_id" INTEGER NOT NULL,
    "properties" JSONB NOT NULL,
    "price" INTEGER NOT NULL,
    "market_price" INTEGER,
    "cost_price" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "pic_url" VARCHAR(512),
    "bar_code" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mall_skus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mall_categories" ADD CONSTRAINT "mall_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "mall_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mall_property_values" ADD CONSTRAINT "mall_property_values_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "mall_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mall_spus" ADD CONSTRAINT "mall_spus_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "mall_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mall_spus" ADD CONSTRAINT "mall_spus_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "mall_brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mall_skus" ADD CONSTRAINT "mall_skus_spu_id_fkey" FOREIGN KEY ("spu_id") REFERENCES "mall_spus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
