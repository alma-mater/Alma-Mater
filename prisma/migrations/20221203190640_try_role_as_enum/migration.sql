-- CreateEnum
CREATE TYPE "NewRole" AS ENUM ('PREGNANT', 'SPECIALIST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "newRole" "NewRole" NOT NULL DEFAULT 'PREGNANT';
