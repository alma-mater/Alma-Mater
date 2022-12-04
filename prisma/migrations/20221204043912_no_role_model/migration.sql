/*
  Warnings:

  - The `authorRole` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `newRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PREGNANT', 'SPECIALIST');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "authorRole",
ADD COLUMN     "authorRole" "UserRole" NOT NULL DEFAULT 'PREGNANT';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "newRole",
DROP COLUMN "roleId",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'PREGNANT';

-- DropTable
DROP TABLE "Role";

-- DropEnum
DROP TYPE "NewRole";
