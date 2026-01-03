-- AlterTable
ALTER TABLE "users" ADD COLUMN     "loginProviders" TEXT[] DEFAULT ARRAY[]::TEXT[];
