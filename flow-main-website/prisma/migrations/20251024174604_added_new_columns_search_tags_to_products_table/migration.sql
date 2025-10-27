-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "searchTags" TEXT[] DEFAULT ARRAY[]::TEXT[];
