/*
  Warnings:

  - You are about to drop the column `due` on the `DiaryPost` table. All the data in the column will be lost.
  - You are about to drop the column `finished` on the `DiaryPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiaryPost" DROP COLUMN "due",
DROP COLUMN "finished";
