import { characterRepository } from "@/api/repositories/characterRepository";
import { startCase } from "lodash";

const normalizeName = (name: string) => {
  return startCase(name);
};

export const characterController = {
  create: async ({
    name,
    raceId,
    classId,
    defaultPilotId,
  }: {
    name: string;
    raceId: number;
    classId: number;
    defaultPilotId?: string;
  }) => {
    return characterRepository.create({
      name: normalizeName(name),
      raceId,
      classId,
      defaultPilotId,
    });
  },

  createClass: async ({
    name,
    colorHexLight,
    colorHexDark,
    allowedRaces,
  }: {
    name: string;
    colorHexLight: string;
    colorHexDark: string;
    allowedRaces: string[];
  }) => {
    return characterRepository.createClass({
      name,
      colorHexLight,
      colorHexDark,
      allowedRaces,
    });
  },

  createRace: async ({ name }: { name: string }) => {
    return characterRepository.createRace({ name });
  },

  isNameAvailable: async ({ name }: { name: string }) => {
    return characterRepository.isNameAvailable({ name: normalizeName(name) });
  },

  isAllowedRaceClassCombination: async ({
    raceId,
    classId,
  }: {
    raceId: number;
    classId: number;
  }) => {
    return characterRepository.isAllowedRaceClassCombination({
      raceId,
      classId,
    });
  },

  get: async ({ take, userId }: { take: number; userId: string }) => {
    return {
      total: await characterRepository.getTotalCharacters({ userId }),
      characters: await characterRepository.getCharacters({ take, userId }),
    };
  },

  getClasses: async ({ raceId }: { raceId?: number }) => {
    return characterRepository.getClasses({ raceId });
  },

  getClassIdByName: async ({ name }: { name: string }) => {
    const cls = await characterRepository.getClassByName({ name });
    return cls.id;
  },

  getRaceIdByName: async ({ name }: { name: string }) => {
    const race = await characterRepository.getRaceByName({ name });
    return race.id;
  },

  getRaces: async ({ classId }: { classId?: number }) => {
    return characterRepository.getRaces({ classId });
  },

  searchByName: async ({ search, take }: { search: string; take: number }) => {
    return characterRepository.searchByName({ search, take });
  },
};
