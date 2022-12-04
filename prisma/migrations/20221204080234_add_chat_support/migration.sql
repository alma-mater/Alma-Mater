/*
  Warnings:

  - You are about to drop the column `anonymous` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ParticipantsInRooms" ADD COLUMN     "chatId" TEXT;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "anonymous";

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialistId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT,
    "authorImage" TEXT,
    "authorRole" "UserRole" NOT NULL DEFAULT 'PREGNANT',
    "chatId" TEXT,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_createdAt_key" ON "Chat"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_updatedAt_key" ON "Chat"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_createdAt_key" ON "ChatMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_updatedAt_key" ON "ChatMessage"("updatedAt");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantsInRooms" ADD CONSTRAINT "ParticipantsInRooms_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
