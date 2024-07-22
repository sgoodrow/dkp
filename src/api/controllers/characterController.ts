import { characterRepository } from "@/api/repositories/characterRepository";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { startCase } from "lodash";

const normalizeName = (name: string) => {
  return startCase(name);
};

type CreateCharacter = {
  name: string;
  raceId: number;
  classId: number;
  defaultPilotId?: string;
};

export const characterController = {
  createMany: async ({ characters }: { characters: CreateCharacter[] }) => {
    return characterRepository.createMany({
      characters: characters.map((c) => {
        return {
          ...c,
          name: normalizeName(c.name),
        };
      }),
    });
  },

  create: async (character: CreateCharacter) => {
    return characterController.createMany({
      characters: [
        {
          ...character,
          name: normalizeName(character.name),
        },
      ],
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
      name: normalizeName(name),
      colorHexLight,
      colorHexDark,
      allowedRaces: allowedRaces.map((r) => normalizeName(r)),
    });
  },

  createRace: async ({ name }: { name: string }) => {
    return characterRepository.createRace({
      name: normalizeName(name),
    });
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

  countByUserId: async ({ userId }: { userId: string }) => {
    return characterRepository.countByUserId({ userId });
  },

  getManyByUserId: async ({
    userId,
    startRow,
    endRow,
    filterModel,
    sortModel,
  }: {
    userId: string;
    startRow: number;
    endRow: number;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return {
      totalRowCount: await characterRepository.countByUserId({
        userId,
        filterModel,
        sortModel,
      }),
      rows: await characterRepository.getManyByUserId({
        userId,
        startRow,
        endRow,
        filterModel,
        sortModel,
      }),
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
