/*
  Warnings:

  - You are about to drop the column `username` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `freetime` on the `Interviewer` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_card]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_card]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Interviewer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_card]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_card` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_card` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Interviewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Interviewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Interviewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_card` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Faculty_username_key";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "username",
ADD COLUMN     "id_card" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "id_card" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Interviewer" DROP COLUMN "freetime",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "CreatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_card" TEXT NOT NULL,
ADD COLUMN     "resume" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_id_card_key" ON "Faculty"("id_card");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_id_card_key" ON "Interview"("id_card");

-- CreateIndex
CREATE UNIQUE INDEX "Interviewer_email_key" ON "Interviewer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_id_card_key" ON "Student"("id_card");
