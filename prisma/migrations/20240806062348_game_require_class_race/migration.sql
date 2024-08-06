/*
  Warnings:

  - Made the column `gameId` on table `CharacterClass` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `CharacterRace` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CharacterClass" DROP CONSTRAINT "CharacterClass_gameId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterRace" DROP CONSTRAINT "CharacterRace_gameId_fkey";

-- AlterTable
ALTER TABLE "CharacterClass" ALTER COLUMN "gameId" SET NOT NULL;

-- AlterTable
ALTER TABLE "CharacterRace" ALTER COLUMN "gameId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CharacterClass" ADD CONSTRAINT "CharacterClass_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterRace" ADD CONSTRAINT "CharacterRace_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
