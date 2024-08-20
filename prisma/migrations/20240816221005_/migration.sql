/*
  Warnings:

  - Added the required column `username` to the `MigrateEqdkpUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MigrateEqdkpUser" ADD COLUMN     "username" TEXT NOT NULL;
