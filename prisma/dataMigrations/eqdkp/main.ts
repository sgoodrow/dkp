import { ENV } from "@/api/env";
import { CharacterClass, CharacterRace } from "@prisma/client";
import { getCharacterAttributesMap } from "prisma/dataMigrations/eqdkp/getCharacterAttributesMap";
import { ingestEqdkpCharacters } from "prisma/dataMigrations/eqdkp/ingestEqdkpCharacters";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting EQ DKP data");

export const eqdkpDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  const { classMap, raceMap } = await getCharacterAttributesMap();

  await ingestEqdkpCharacters({ classMap, raceMap });

  logger.info("Finished workflow.");
};
