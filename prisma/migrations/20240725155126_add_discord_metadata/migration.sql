-- CreateTable
CREATE TABLE "UserDiscordMetadata" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "roleIds" TEXT[],
    "userId" TEXT,

    CONSTRAINT "UserDiscordMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDiscordMetadata_memberId_key" ON "UserDiscordMetadata"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDiscordMetadata_userId_key" ON "UserDiscordMetadata"("userId");

-- AddForeignKey
ALTER TABLE "UserDiscordMetadata" ADD CONSTRAINT "UserDiscordMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
