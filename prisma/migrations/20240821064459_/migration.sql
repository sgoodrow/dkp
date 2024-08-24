/*
  Warnings:

  - You are about to drop the column `error` on the `MigrateAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `importedCharacters` on the `MigrateAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `importedRaidActivities` on the `MigrateAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `importedRaidActivityTypes` on the `MigrateAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `importedUsers` on the `MigrateAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `MigrateAttempt` table. All the data in the column will be lost.
  - You are about to drop the `MigrateEqdkpUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "MigrateAttempt" DROP COLUMN "error",
DROP COLUMN "importedCharacters",
DROP COLUMN "importedRaidActivities",
DROP COLUMN "importedRaidActivityTypes",
DROP COLUMN "importedUsers",
DROP COLUMN "status",
ADD COLUMN     "lastMigratedRemoteCharacterId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastMigratedRemoteRaidActivityId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastMigratedRemoteRaidActivityTypeId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastMigratedRemoteUserId" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "MigrateEqdkpUser";

-- DropEnum
DROP TYPE "MigrateAttemptStatus";

-- CreateTable
CREATE TABLE "MigrateUser" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "remoteUserId" INTEGER NOT NULL,

    CONSTRAINT "MigrateUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MigrateInvalidCharacter" (
    "id" SERIAL NOT NULL,
    "remoteCharacterId" INTEGER NOT NULL,
    "missingOwner" BOOLEAN NOT NULL DEFAULT false,
    "invalidName" BOOLEAN NOT NULL DEFAULT false,
    "duplicateNormalizedName" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MigrateInvalidCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MigrateUser_userId_key" ON "MigrateUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MigrateUser_remoteUserId_key" ON "MigrateUser"("remoteUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MigrateInvalidCharacter_remoteCharacterId_key" ON "MigrateInvalidCharacter"("remoteCharacterId");
