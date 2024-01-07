/*
  Warnings:

  - Changed the type of `role` on the `Person` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR', 'OTHER');

-- AlterTable
-- ALTER TABLE "Person" DROP COLUMN "role",
-- ADD COLUMN     "role" "Role" NOT NULL;

-- Instead of the above, we will keep the data from the existing role string column by creating a new role enum column and copying the data over
ALTER TABLE "Person" ADD COLUMN "role_enum" "Role";
-- Update the new role enum column with the data from the existing role string column
UPDATE "Person" SET "role_enum" = 'STUDENT' WHERE "role" = 'student';
UPDATE "Person" SET "role_enum" = 'MENTOR' WHERE "role" = 'mentor';
UPDATE "Person" SET "role_enum" = 'OTHER' WHERE "role" = 'other';
-- Drop the old role string column
ALTER TABLE "Person" DROP COLUMN "role";
-- Rename the new role enum column to the old role string column name
ALTER TABLE "Person" RENAME COLUMN "role_enum" TO "role";
