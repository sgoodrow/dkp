/*
  Warnings:

  - You are about to drop the column `discordInviteLink` on the `Guild` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GuildStatus" AS ENUM ('INSTALLING', 'READY');

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "discordInviteLink",
ADD COLUMN     "status" "GuildStatus" NOT NULL DEFAULT 'INSTALLING',
ALTER COLUMN "rulesLink" DROP NOT NULL;
