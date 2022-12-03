/*
  Warnings:

  - You are about to drop the column `topicId` on the `DiaryPost` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `Room` table. All the data in the column will be lost.
  - Added the required column `hashtagId` to the `DiaryPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DiaryPost" DROP CONSTRAINT "DiaryPost_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_topicId_fkey";

-- AlterTable
ALTER TABLE "DiaryPost" DROP COLUMN "topicId",
ADD COLUMN     "hashtagId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "topicId",
ADD COLUMN     "hashtagId" TEXT;

-- AddForeignKey
ALTER TABLE "DiaryPost" ADD CONSTRAINT "DiaryPost_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
