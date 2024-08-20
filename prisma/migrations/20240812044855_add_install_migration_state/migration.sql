/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MigrateEqdkpUser` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MigrateEqdkpUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eqdkpUserId]` on the table `MigrateEqdkpUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dryRun` to the `MigrateAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "InstallAttemptStatus" ADD VALUE 'READY_FOR_IMPORT';

-- AlterTable
ALTER TABLE "MigrateAttempt" ADD COLUMN     "dryRun" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "MigrateEqdkpUser" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "MigrateEqdkpUser_eqdkpUserId_key" ON "MigrateEqdkpUser"("eqdkpUserId");
