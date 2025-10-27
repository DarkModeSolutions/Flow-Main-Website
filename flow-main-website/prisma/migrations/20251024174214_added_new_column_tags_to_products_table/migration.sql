-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
