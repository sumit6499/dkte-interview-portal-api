-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "facultyId" TEXT,
ADD COLUMN     "interviewerId" TEXT;

-- CreateTable
CREATE TABLE "Interviewer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "free_day" "Day" NOT NULL,
    "freetime" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Interviewer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interviewer_phone_key" ON "Interviewer"("phone");

-- CreateIndex
CREATE INDEX "Interview_id_idx" ON "Interview"("id");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Interviewer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
