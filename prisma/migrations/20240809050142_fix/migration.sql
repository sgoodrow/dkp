-- AlterTable
ALTER TABLE "InstallAttempt" ADD COLUMN     "importedCharacters" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "importedRaidActivities" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "importedRaidActivityTypes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "installedClasses" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "installedGuild" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "installedItems" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "installedRaces" BOOLEAN NOT NULL DEFAULT false;
