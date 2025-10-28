-- AlterTable
ALTER TABLE "public"."addresses" ADD COLUMN     "addressName" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
