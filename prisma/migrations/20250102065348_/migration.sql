-- CreateTable
CREATE TABLE "KioskKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "KioskKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KioskKey_key_key" ON "KioskKey"("key");
