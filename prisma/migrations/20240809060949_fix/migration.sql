-- AlterTable
ALTER TABLE "InstallAttempt" ADD COLUMN     "syncedDiscordMetadata" BOOLEAN DEFAULT false,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "importedCharacters" DROP NOT NULL,
ALTER COLUMN "importedRaidActivities" DROP NOT NULL,
ALTER COLUMN "importedRaidActivityTypes" DROP NOT NULL,
ALTER COLUMN "installedClasses" DROP NOT NULL,
ALTER COLUMN "installedGuild" DROP NOT NULL,
ALTER COLUMN "installedItems" DROP NOT NULL,
ALTER COLUMN "installedRaces" DROP NOT NULL;
