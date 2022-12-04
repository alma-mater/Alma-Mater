/*
  Warnings:

  - You are about to drop the column `chatId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `ParticipantsInRooms` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pregnantId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_pregnantId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantsInRooms" DROP CONSTRAINT "ParticipantsInRooms_chatId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatId";

-- AlterTable
ALTER TABLE "ParticipantsInRooms" DROP COLUMN "chatId";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatMessage";
