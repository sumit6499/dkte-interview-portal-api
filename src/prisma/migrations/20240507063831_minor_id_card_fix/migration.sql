/*
  Warnings:

  - You are about to drop the column `id_card` on the `Interview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_card]` on the table `Interviewer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_card` to the `Interviewer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Interview_id_card_key";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "id_card";

-- AlterTable
ALTER TABLE "Interviewer" ADD COLUMN     "id_card" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Interviewer_id_card_key" ON "Interviewer"("id_card");
