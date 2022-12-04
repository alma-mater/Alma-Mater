/*
  Warnings:

  - Added the required column `polyclinicId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "polyclinicId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_polyclinicId_fkey" FOREIGN KEY ("polyclinicId") REFERENCES "Polyclinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
