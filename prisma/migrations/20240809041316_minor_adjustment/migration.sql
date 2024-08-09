/*
  Warnings:

  - The values [READY] on the enum `GuildStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GuildStatus_new" AS ENUM ('INSTALLING', 'ACTIVE');
ALTER TABLE "Guild" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Guild" ALTER COLUMN "status" TYPE "GuildStatus_new" USING ("status"::text::"GuildStatus_new");
ALTER TYPE "GuildStatus" RENAME TO "GuildStatus_old";
ALTER TYPE "GuildStatus_new" RENAME TO "GuildStatus";
DROP TYPE "GuildStatus_old";
ALTER TABLE "Guild" ALTER COLUMN "status" SET DEFAULT 'INSTALLING';
COMMIT;
