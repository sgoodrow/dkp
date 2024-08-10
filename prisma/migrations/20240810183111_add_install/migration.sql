/*
  Warnings:

  - You are about to drop the column `createdByUserId` on the `DiscordSyncEvent` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `DiscordUserMetadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raidActivityId` on table `WalletTransaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InstallAttemptStatus" AS ENUM ('IN_PROGRESS', 'FAIL', 'SUCCESS');

-- CreateEnum
CREATE TYPE "MigrateAttemptStatus" AS ENUM ('IN_PROGRESS', 'FAIL', 'SUCCESS');

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordSyncEvent" DROP CONSTRAINT "DiscordSyncEvent_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordUserMetadata" DROP CONSTRAINT "DiscordUserMetadata_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_raidActivityId_fkey";

-- AlterTable
ALTER TABLE "DiscordSyncEvent" DROP COLUMN "createdByUserId",
ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "DiscordUserMetadata" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "WalletTransaction" ALTER COLUMN "raidActivityId" SET NOT NULL;

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "rulesLink" TEXT,
    "discordServerId" TEXT NOT NULL,
    "discordOwnerRoleId" TEXT NOT NULL,
    "discordAdminRoleId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallAttempt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "InstallAttemptStatus" NOT NULL,
    "error" TEXT,
    "installedRaces" BOOLEAN DEFAULT false,
    "installedClasses" BOOLEAN DEFAULT false,
    "installedRaceClassCombos" BOOLEAN DEFAULT false,
    "installedItems" BOOLEAN DEFAULT false,
    "installedGuild" BOOLEAN DEFAULT false,
    "syncedDiscordMetadata" BOOLEAN DEFAULT false,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "InstallAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MigrateAttempt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "MigrateAttemptStatus" NOT NULL,
    "error" TEXT,
    "importedUsers" BOOLEAN DEFAULT false,
    "importedCharacters" BOOLEAN DEFAULT false,
    "importedRaidActivityTypes" BOOLEAN DEFAULT false,
    "importedRaidActivities" BOOLEAN DEFAULT false,
    "syncedDiscordMetadata" BOOLEAN DEFAULT false,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "MigrateAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_discordServerId_key" ON "Guild"("discordServerId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_createdById_key" ON "Guild"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_updatedById_key" ON "Guild"("updatedById");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordUserMetadata" ADD CONSTRAINT "DiscordUserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordSyncEvent" ADD CONSTRAINT "DiscordSyncEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallAttempt" ADD CONSTRAINT "InstallAttempt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MigrateAttempt" ADD CONSTRAINT "MigrateAttempt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_raidActivityId_fkey" FOREIGN KEY ("raidActivityId") REFERENCES "RaidActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
