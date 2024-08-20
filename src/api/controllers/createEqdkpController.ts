import { characterController } from "@/api/controllers/characterController";
import { eqdkpRepository } from "@/api/repositories/eqdkpRepository";
import { getPrismaEqdkp } from "@/api/repositories/shared/prismaEqdkp";
import { character } from "@/shared/utils/character";
import { CharacterClass, CharacterRace } from "@prisma/client";
import { unknown, z } from "zod";

const profiledataSchema = z.object({
  race: z.union([z.string(), z.number()]),
  class: z.union([z.string(), z.number()]),
});

export const createEqdkpController = ({ dbUrl }: { dbUrl: string }) => {
  const client = getPrismaEqdkp({ dbUrl });

  const getRaceMap = async () => {
    const races = await characterController().getRaces({});
    const eqdkpRaces = await eqdkpRepository(client).getRaces();

    return eqdkpRaces.reduce<{
      [eqdkpId: string]: CharacterRace | null;
    }>((acc, { id, name }) => {
      const r = races.find((r) => r.name.toLowerCase() === name.toLowerCase());
      acc[id] = r || null;
      return acc;
    }, {});
  };

  const getClassMap = async () => {
    const classes = await characterController().getClasses({});
    const eqdkpClasses = await eqdkpRepository(client).getClasses();

    return eqdkpClasses.reduce<{
      [eqdkpId: string]: CharacterClass | null;
    }>((acc, { id, name }) => {
      const c = classes.find(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      acc[id] = c || null;
      return acc;
    }, {});
  };

  return () => ({
    getFirstUser: async () => {
      return eqdkpRepository(client).getFirstUser();
    },

    getManyRaidActivityTypes: async ({
      skip,
      take,
    }: {
      skip: number;
      take: number;
    }) => {
      return eqdkpRepository(client).getManyRaidActivityTypes({
        skip,
        take,
      });
    },

    getManyRaidActivities: async ({
      skip,
      take,
    }: {
      skip: number;
      take: number;
    }) => {
      return eqdkpRepository(client).getManyRaidActivities({
        skip,
        take,
      });
    },

    getManyUsers: async ({ take, skip }: { take: number; skip: number }) => {
      return eqdkpRepository(client).getManyUsers({
        take,
        skip,
      });
    },

    getManyAdjustmentsWithoutRaidActivities: async ({
      skip,
      take,
    }: {
      skip: number;
      take: number;
    }) => {
      return eqdkpRepository(client).getManyAdjustmentsWithoutRaidActivities({
        skip,
        take,
      });
    },

    getManyCharacters: async ({
      skip,
      take,
    }: {
      skip: number;
      take: number;
    }) => {
      const raceMap = await getRaceMap();
      const classMap = await getClassMap();
      const unknownRaceId = await characterController().getRaceIdByName({
        name: "Unknown Race",
      });

      const unknownClassId = await characterController().getClassIdByName({
        name: "Unknown Class",
      });
      const characters = await eqdkpRepository(client).getManyCharacters({
        skip,
        take,
      });
      return characters.map(
        ({ userCharacter, member_id, member_name, profiledata }) => {
          const data =
            profiledata?.toString() === ""
              ? undefined
              : profiledataSchema.parse(profiledata);
          return {
            name: character.normalizeName(member_name.split(" ")[0]),
            eqdkpId: Number(member_id),
            eqdkpUserId: Number(userCharacter?.user_id),
            classId: data
              ? classMap[data.class]?.id || unknownClassId
              : unknownClassId,
            raceId: data
              ? raceMap[data.race]?.id || unknownRaceId
              : unknownRaceId,
          };
        },
      );
    },
  });
};

export type EqdkpController = ReturnType<typeof createEqdkpController>;
