-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "zohoAccessToken" TEXT,
ADD COLUMN     "zohoRefreshToken" TEXT,
ADD COLUMN     "zohoTokenExpiry" TIMESTAMP(3);
