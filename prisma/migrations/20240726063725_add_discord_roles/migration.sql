/*
  Warnings:

  - You are about to drop the `UserDiscordMetadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDiscordMetadata" DROP CONSTRAINT "UserDiscordMetadata_userId_fkey";

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "clearedByUserId" TEXT,
ADD COLUMN     "requiredIntervention" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "UserDiscordMetadata";

-- CreateTable
CREATE TABLE "DiscordUserMetadata" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "roleIds" TEXT[],
    "userId" TEXT,

    CONSTRAINT "DiscordUserMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordSyncEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT NOT NULL,

    CONSTRAINT "DiscordSyncEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "color" TEXT,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "DiscordRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUserMetadata_memberId_key" ON "DiscordUserMetadata"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUserMetadata_userId_key" ON "DiscordUserMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordRole_name_key" ON "DiscordRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordRole_roleId_key" ON "DiscordRole"("roleId");

-- AddForeignKey
ALTER TABLE "DiscordUserMetadata" ADD CONSTRAINT "DiscordUserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordSyncEvent" ADD CONSTRAINT "DiscordSyncEvent_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_clearedByUserId_fkey" FOREIGN KEY ("clearedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
