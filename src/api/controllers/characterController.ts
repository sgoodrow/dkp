import { characterRepository } from "@/api/repositories/characterRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { groupBy, mapValues, uniq } from "lodash";

export const characterController = (p?: PrismaTransactionClient) => ({
  createMany: async ({
    characters,
  }: {
    characters: {
      name: string;
      raceId: number;
      classId: number;
      defaultPilotId: string | null;
    }[];
  }) => {
    return characterRepository(p).createMany({ characters });
  },

  upsert: async ({
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
    return characterRepository(p).upsert({
      name,
      raceId,
      classId,
      defaultPilotId,
    });
  },

  createClasses: async ({
    classes,
  }: {
    classes: {
      name: string;
      colorHexLight: string;
      colorHexDark: string;
    }[];
  }) => {
    return characterRepository(p).createClasses({ classes });
  },

  createRaces: async ({ races }: { races: { name: string }[] }) => {
    await characterRepository(p).createRaces(races);
  },

  createRaceClassCombinations: async ({
    classCombinations,
  }: {
    classCombinations: {
      name: string;
      allowedRaces: string[];
    }[];
  }) => {
    return characterRepository(p).createRaceClassCombinations({
      classCombinations,
    });
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

  getCharacterValidator: async () => {
    const map = mapValues(
      groupBy(
        await characterRepository(p).getRaceClassCombinations(),
        ({ classId }) => classId,
      ),
      (group) => uniq(group.map(({ raceId }) => raceId)),
    );
    return ({ classId, raceId }: { classId?: number; raceId?: number }) =>
      classId !== undefined &&
      raceId !== undefined &&
      map[classId]?.includes(raceId);
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

  getManyWithoutOwner: async (agGrid: AgGrid) => {
    return {
      totalRowCount:
        await characterRepository(p).countWithoutDefaultPilot(agGrid),
      rows: await characterRepository(p).getManyWithoutDefaultPilot(agGrid),
    };
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
    return characterRepository(p).getCharacterNameMap({
      characterNames,
    });
  },
});
