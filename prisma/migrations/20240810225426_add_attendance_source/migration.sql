/*
  Warnings:

  - Added the required column `source` to the `AttendanceLogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceLogEntrySource" AS ENUM ('KIOSK', 'DASHBOARD');

-- AlterTable
ALTER TABLE "AttendanceLogEntry" ADD COLUMN     "enteredById" TEXT,
ADD COLUMN     "includeTime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" "AttendanceLogEntrySource" NOT NULL;

-- AddForeignKey
ALTER TABLE "AttendanceLogEntry" ADD CONSTRAINT "AttendanceLogEntry_enteredById_fkey" FOREIGN KEY ("enteredById") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
