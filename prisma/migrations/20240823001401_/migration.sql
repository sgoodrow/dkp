/*
  Warnings:

  - Added the required column `name` to the `MigrateInvalidCharacter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MigrateInvalidCharacter" ADD COLUMN     "name" TEXT NOT NULL;
