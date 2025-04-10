/*
  Warnings:

  - You are about to drop the `AttendanceLogEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendanceLogEntry" DROP CONSTRAINT "AttendanceLogEntry_enteredById_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceLogEntry" DROP CONSTRAINT "AttendanceLogEntry_personId_fkey";

-- DropTable
DROP TABLE "AttendanceLogEntry";

-- DropEnum
DROP TYPE "AttendanceLogEntrySource";
