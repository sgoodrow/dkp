/*
  Warnings:

  - You are about to drop the column `discordAdminRoleId` on the `Guild` table. All the data in the column will be lost.
  - Added the required column `discordHelperRoleId` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "discordAdminRoleId",
ADD COLUMN     "discordHelperRoleId" TEXT NOT NULL;
