import { raidActivityController } from "@/api/controllers/raidActivityController";
import { characterRepository } from "@/api/repositories/characterRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/client";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { startCase } from "lodash";

type CreateCharacter = {
  name: string;
  raceId: number;
  classId: number;
  defaultPilotId?: string;
};

export const characterController = (p?: PrismaTransactionClient) => ({
  createMany: async ({ characters }: { characters: CreateCharacter[] }) => {
    return characterRepository(p).createMany({ characters });
  },

  create: async (character: CreateCharacter) => {
    return characterController(p).createMany({
      characters: [character],
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
    return characterRepository(p).createClass({
      name,
      colorHexLight,
      colorHexDark,
      allowedRaces,
    });
  },

  createRace: async ({ name }: { name: string }) => {
    return characterRepository(p).createRace({ name });
  },

  isNameAvailable: async ({ name }: { name: string }) => {
    return characterRepository(p).isNameAvailable({ name });
  },

  isAllowedRaceClassCombination: async ({
    raceId,
    classId,
  }: {
    raceId: number;
    classId: number;
  }) => {
    return characterRepository(p).isAllowedRaceClassCombination({
      raceId,
      classId,
    });
  },

  countByUserId: async ({ userId }: { userId: string }) => {
    return characterRepository(p).countByUserId({ userId });
  },

  getManyByNameMatch: async ({ names }: { names: string[] }) => {
    return characterRepository(p).getManyByNameMatch({ names });
  },

  getByRaidActivityId: async ({
    raidActivityId,
  }: {
    raidActivityId: number;
  }) => {
    return characterRepository(p).getByRaidActivityId({ raidActivityId });
  },

  getPilotIdFromNames: async ({
    characterName,
    pilotCharacterName,
  }: {
    characterName: string;
    pilotCharacterName?: string;
  }) => {
    const pilotCharacter = pilotCharacterName
      ? await characterController(p).getByNameMatch({
          search: pilotCharacterName,
        })
      : null;

    if (pilotCharacter?.defaultPilotId) {
      return pilotCharacter.defaultPilotId;
    }

    const character = await characterController(p).getByNameMatch({
      search: characterName,
    });

    if (character?.defaultPilotId) {
      return character.defaultPilotId;
    }

    return null;
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
      totalRowCount: await characterRepository(p).countByUserId({
        userId,
        filterModel,
        sortModel,
      }),
      rows: await characterRepository(p).getManyByUserId({
        userId,
        startRow,
        endRow,
        filterModel,
        sortModel,
      }),
    };
  },

  getClasses: async ({ raceId }: { raceId?: number }) => {
    return characterRepository(p).getClasses({ raceId });
  },

  getClassIdByName: async ({ name }: { name: string }) => {
    const cls = await characterRepository(p).getClassByName({ name });
    return cls.id;
  },

  getRaceIdByName: async ({ name }: { name: string }) => {
    const race = await characterRepository(p).getRaceByName({ name });
    return race.id;
  },

  getRaces: async ({ classId }: { classId?: number }) => {
    return characterRepository(p).getRaces({ classId });
  },

  getByNameMatch: async ({ search }: { search: string }) => {
    return characterRepository(p).getByNameMatch({ search });
  },

  getByNameIncludes: async ({
    search,
    take,
  }: {
    search: string;
    take: number;
  }) => {
    return characterRepository(p).getByNameIncludes({ search, take });
  },

  getCharacterNameMap: async ({
    characterNames,
  }: {
    characterNames: string[];
  }) => {
    const map = await characterRepository(p).getCharacterNameMap({
      characterNames,
    });
    return {
      get: (characterName?: string) =>
        characterName === undefined ? null : map[characterName] || null,
    };
  },
});
