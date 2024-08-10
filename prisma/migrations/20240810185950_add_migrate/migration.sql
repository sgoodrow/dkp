-- CreateTable
CREATE TABLE "MigrateEqdkpUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eqdkpUserId" INTEGER NOT NULL,
    "email" TEXT,

    CONSTRAINT "MigrateEqdkpUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MigrateEqdkpUser_email_key" ON "MigrateEqdkpUser"("email");
