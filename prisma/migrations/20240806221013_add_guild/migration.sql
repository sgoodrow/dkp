/*
  Warnings:

  - You are about to drop the column `gameId` on the `CharacterClass` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `CharacterRace` table. All the data in the column will be lost.
  - You are about to drop the column `createdByUserId` on the `DiscordSyncEvent` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `DiscordUserMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GuildToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[updatedById]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - Made the column `walletId` on table `WalletTransaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raidActivityId` on table `WalletTransaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterClass" DROP CONSTRAINT "CharacterClass_gameId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterRace" DROP CONSTRAINT "CharacterRace_gameId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordSyncEvent" DROP CONSTRAINT "DiscordSyncEvent_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordUserMetadata" DROP CONSTRAINT "DiscordUserMetadata_userId_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_gameId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_raidActivityId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_walletId_fkey";

-- DropForeignKey
ALTER TABLE "_GuildToUser" DROP CONSTRAINT "_GuildToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GuildToUser" DROP CONSTRAINT "_GuildToUser_B_fkey";

-- AlterTable
ALTER TABLE "CharacterClass" DROP COLUMN "gameId";

-- AlterTable
ALTER TABLE "CharacterRace" DROP COLUMN "gameId";

-- AlterTable
ALTER TABLE "DiscordSyncEvent" DROP COLUMN "createdByUserId",
ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "createdById",
DROP COLUMN "gameId";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "gameId";

-- AlterTable
ALTER TABLE "WalletTransaction" ALTER COLUMN "walletId" SET NOT NULL,
ALTER COLUMN "raidActivityId" SET NOT NULL;

-- DropTable
DROP TABLE "DiscordUserMetadata";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "_GuildToUser";

-- CreateTable
CREATE TABLE "DiscordMemberMetadata" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "roleIds" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "DiscordMemberMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordMemberMetadata_discordId_key" ON "DiscordMemberMetadata"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordMemberMetadata_userId_key" ON "DiscordMemberMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_updatedById_key" ON "Guild"("updatedById");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordMemberMetadata" ADD CONSTRAINT "DiscordMemberMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordSyncEvent" ADD CONSTRAINT "DiscordSyncEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_raidActivityId_fkey" FOREIGN KEY ("raidActivityId") REFERENCES "RaidActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
