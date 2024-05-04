-- CreateEnum
CREATE TYPE "Dept" AS ENUM ('CSE', 'AI', 'AIDS', 'ENTC', 'MECH', 'ELECTRIC', 'CIVIL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Student', 'Interviewer');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "PRN" TEXT NOT NULL,
    "dept" "Dept" NOT NULL DEFAULT 'CSE',
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Student',
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dept" "Dept" NOT NULL DEFAULT 'CSE',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "link" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "technical" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "behaviour" INTEGER NOT NULL,
    "apperance" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_PRN_key" ON "Student"("PRN");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");

-- CreateIndex
CREATE INDEX "Student_id_PRN_idx" ON "Student"("id", "PRN");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_username_key" ON "Faculty"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_phone_key" ON "Faculty"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_email_key" ON "Faculty"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_link_key" ON "Interview"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_interviewId_key" ON "Feedback"("interviewId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
