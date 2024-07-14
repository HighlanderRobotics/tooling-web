-- CreateTable
CREATE TABLE "AttendanceLogEntry" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceLogEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttendanceLogEntry" ADD CONSTRAINT "AttendanceLogEntry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
