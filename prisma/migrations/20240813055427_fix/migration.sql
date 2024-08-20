/*
  Warnings:

  - You are about to drop the column `installedRaceClassCombos` on the `InstallAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `syncedDiscordMetadata` on the `MigrateAttempt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InstallAttempt" DROP COLUMN "installedRaceClassCombos",
ADD COLUMN     "installedRaceClassCombinations" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "MigrateAttempt" DROP COLUMN "syncedDiscordMetadata";
