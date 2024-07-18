-- AlterTable
ALTER TABLE "Interviewer" ADD COLUMN     "adminValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isValidated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "isValidated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "adminValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isValidated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "interviewID" TEXT NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_studentId_key" ON "Otp"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_interviewID_key" ON "Otp"("interviewID");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_interviewID_fkey" FOREIGN KEY ("interviewID") REFERENCES "Interviewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
