import { characterController } from "@/api/controllers/characterController";
import { CharacterClass, CharacterRace } from "@prisma/client";
import { lowerCase } from "lodash";
import { eqdkpController } from "prisma/dataMigrations/eqdkp/eqdkpController";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Getting  EQ DKP character attributes map");

export type RaceMap = {
  [eqdkpId: string]: CharacterRace | null;
};

export type ClassMap = {
  [eqdkpId: string]: CharacterClass | null;
};

export const getCharacterAttributesMap = async () => {
  const races = await characterController().getRaces({});
  const classes = await characterController().getClasses({});

  logger.info("Started workflow.");

  const eqdkpRaces = await eqdkpController().getRaces();
  const eqdkpClasses = await eqdkpController().getClasses();

  const raceMap = eqdkpRaces.reduce<RaceMap>((acc, { id, name }) => {
    const r = races.find((r) => lowerCase(r.name) === lowerCase(name));
    acc[id] = r || null;
    return acc;
  }, {});

  const classMap = eqdkpClasses.reduce<ClassMap>((acc, { id, name }) => {
    const c = classes.find((c) => lowerCase(c.name) === lowerCase(name));
    acc[id] = c || null;
    return acc;
  }, {});

  logger.info("Finished workflow.");

  return {
    raceMap,
    classMap,
  };
};
