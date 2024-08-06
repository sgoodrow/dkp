-- AlterTable
ALTER TABLE "CharacterClass" ADD COLUMN     "gameId" INTEGER;

-- AlterTable
ALTER TABLE "CharacterRace" ADD COLUMN     "gameId" INTEGER;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "gameId" INTEGER;

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "discordServerId" TEXT NOT NULL,
    "discordClientId" TEXT NOT NULL,
    "discordAdminRoleId" TEXT NOT NULL,
    "discordInviteLink" TEXT NOT NULL,
    "rulesLink" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GuildToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_discordServerId_key" ON "Guild"("discordServerId");

-- CreateIndex
CREATE UNIQUE INDEX "_GuildToUser_AB_unique" ON "_GuildToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GuildToUser_B_index" ON "_GuildToUser"("B");

-- AddForeignKey
ALTER TABLE "CharacterClass" ADD CONSTRAINT "CharacterClass_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterRace" ADD CONSTRAINT "CharacterRace_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuildToUser" ADD CONSTRAINT "_GuildToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuildToUser" ADD CONSTRAINT "_GuildToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
