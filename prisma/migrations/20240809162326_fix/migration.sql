/*
  Warnings:

  - Added the required column `discordOwnerRoleId` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "discordOwnerRoleId" TEXT NOT NULL;
