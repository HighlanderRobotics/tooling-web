-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('SAFETY_QUIZ', 'LAB_LAYOUT_EMERGENCY_PREPAREDNESS');

-- CreateTable
CREATE TABLE "QuizSubmission" (
    "id" TEXT NOT NULL,
    "submitterId" TEXT,
    "submitterEmail" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quizType" "QuizType" NOT NULL,
    "answers" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,

    CONSTRAINT "QuizSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
