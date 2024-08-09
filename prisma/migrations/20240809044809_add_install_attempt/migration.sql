/*
  Warnings:

  - You are about to drop the column `status` on the `Guild` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InstallAttemptStatus" AS ENUM ('IN_PROGRESS', 'FAIL', 'SUCCESS');

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "status";

-- DropEnum
DROP TYPE "GuildStatus";

-- CreateTable
CREATE TABLE "InstallAttempt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "InstallAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "error" TEXT,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "InstallAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstallAttempt_createdById_key" ON "InstallAttempt"("createdById");

-- AddForeignKey
ALTER TABLE "InstallAttempt" ADD CONSTRAINT "InstallAttempt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
