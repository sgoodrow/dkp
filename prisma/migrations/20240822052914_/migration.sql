-- CreateTable
CREATE TABLE "MigrateCharacter" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "remoteCharacterId" INTEGER NOT NULL,

    CONSTRAINT "MigrateCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MigrateRaidActivityType" (
    "id" SERIAL NOT NULL,
    "raidActivityTypeId" INTEGER NOT NULL,
    "remoteRaidActivityTypeId" INTEGER NOT NULL,

    CONSTRAINT "MigrateRaidActivityType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MigrateCharacter_characterId_key" ON "MigrateCharacter"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "MigrateCharacter_remoteCharacterId_key" ON "MigrateCharacter"("remoteCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "MigrateRaidActivityType_raidActivityTypeId_key" ON "MigrateRaidActivityType"("raidActivityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "MigrateRaidActivityType_remoteRaidActivityTypeId_key" ON "MigrateRaidActivityType"("remoteRaidActivityTypeId");
