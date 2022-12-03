-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PREGNANT', 'SPECIALIST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";
