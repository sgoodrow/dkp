-- AddForeignKey
ALTER TABLE "MigrateEqdkpUser" ADD CONSTRAINT "MigrateEqdkpUser_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
