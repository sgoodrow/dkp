-- DropForeignKey
ALTER TABLE "DiscordSyncEvent" DROP CONSTRAINT "DiscordSyncEvent_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "DiscordSyncEvent" ALTER COLUMN "createdByUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscordSyncEvent" ADD CONSTRAINT "DiscordSyncEvent_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
