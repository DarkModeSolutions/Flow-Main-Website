/*
  Warnings:

  - You are about to drop the `order_items_holder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."order_items_holder" DROP CONSTRAINT "order_items_holder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items_holder" DROP CONSTRAINT "order_items_holder_productId_fkey";

-- DropTable
DROP TABLE "public"."order_items_holder";
