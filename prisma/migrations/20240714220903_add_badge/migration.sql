-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "payload" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Badge_payload_key" ON "Badge"("payload");

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
