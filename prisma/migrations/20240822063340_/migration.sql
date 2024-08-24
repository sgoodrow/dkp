-- AlterTable
ALTER TABLE "MigrateAttempt" ALTER COLUMN "lastMigratedRemoteCharacterId" DROP NOT NULL,
ALTER COLUMN "lastMigratedRemoteCharacterId" DROP DEFAULT,
ALTER COLUMN "lastMigratedRemoteRaidActivityId" DROP NOT NULL,
ALTER COLUMN "lastMigratedRemoteRaidActivityId" DROP DEFAULT,
ALTER COLUMN "lastMigratedRemoteRaidActivityTypeId" DROP NOT NULL,
ALTER COLUMN "lastMigratedRemoteRaidActivityTypeId" DROP DEFAULT,
ALTER COLUMN "lastMigratedRemoteUserId" DROP NOT NULL,
ALTER COLUMN "lastMigratedRemoteUserId" DROP DEFAULT;
