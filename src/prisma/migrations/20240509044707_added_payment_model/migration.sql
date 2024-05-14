-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Admin';

-- AlterTable
ALTER TABLE "Interviewer" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Interviewer';

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_studentId_key" ON "Payment"("studentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
