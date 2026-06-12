-- CreateTable
CREATE TABLE "infra_codegen_tables" (
    "id" SERIAL NOT NULL,
    "table_name" VARCHAR(100) NOT NULL,
    "table_comment" VARCHAR(500) NOT NULL,
    "class_name" VARCHAR(100) NOT NULL,
    "module_name" VARCHAR(100) NOT NULL,
    "business_name" VARCHAR(100) NOT NULL,
    "class_comment" VARCHAR(200) NOT NULL,
    "author" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infra_codegen_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_codegen_columns" (
    "id" SERIAL NOT NULL,
    "table_id" INTEGER NOT NULL,
    "column_name" VARCHAR(100) NOT NULL,
    "data_type" VARCHAR(100) NOT NULL,
    "column_comment" VARCHAR(500) NOT NULL,
    "nullable" BOOLEAN NOT NULL DEFAULT true,
    "primary_key" BOOLEAN NOT NULL DEFAULT false,
    "auto_increment" BOOLEAN NOT NULL DEFAULT false,
    "ts_type" VARCHAR(50) NOT NULL,
    "prisma_type" VARCHAR(50) NOT NULL,
    "crud" BOOLEAN NOT NULL DEFAULT true,
    "list_operation" BOOLEAN NOT NULL DEFAULT true,
    "list_operation_condition" VARCHAR(20) NOT NULL DEFAULT '=',
    "form_operation" BOOLEAN NOT NULL DEFAULT true,
    "html_type" VARCHAR(50) NOT NULL DEFAULT 'input',
    "dict_type" VARCHAR(100),

    CONSTRAINT "infra_codegen_columns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "infra_codegen_tables_table_name_key" ON "infra_codegen_tables"("table_name");

-- AddForeignKey
ALTER TABLE "infra_codegen_columns" ADD CONSTRAINT "infra_codegen_columns_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "infra_codegen_tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;
