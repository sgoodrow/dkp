import { characterController } from "@/api/controllers/characterController";
import { CharacterClass, CharacterRace } from "@prisma/client";
import { eqdkpRepository } from "prisma/dataMigrations/eqdkp/eqdkpRepository";
import { EqDkpPlusPrismaTransactionClient } from "prisma/dataMigrations/eqdkp/prismaEqdkp";
import { z } from "zod";

const profiledataSchema = z.object({
  race: z.union([z.string(), z.number()]),
  class: z.union([z.string(), z.number()]),
});

export const eqdkpController = (p?: EqDkpPlusPrismaTransactionClient) => ({
  getRaceMap: async () => {
    const races = await characterController().getRaces({});
    const eqdkpRaces = await eqdkpRepository(p).getRaces();

    return eqdkpRaces.reduce<{
      [eqdkpId: string]: CharacterRace | null;
    }>((acc, { id, name }) => {
      const r = races.find((r) => r.name.toLowerCase() === name.toLowerCase());
      acc[id] = r || null;
      return acc;
    }, {});
  },

  getClassMap: async () => {
    const classes = await characterController().getClasses({});
    const eqdkpClasses = await eqdkpRepository(p).getClasses();

    return eqdkpClasses.reduce<{
      [eqdkpId: string]: CharacterClass | null;
    }>((acc, { id, name }) => {
      const c = classes.find(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      acc[id] = c || null;
      return acc;
    }, {});
  },

  getManyRaidActivityTypes: async ({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }) => {
    const activityTypes = await eqdkpRepository(p).getManyRaidActivityTypes({
      skip,
      take,
    });
    if (activityTypes.length === 0) {
      return null;
    }
    return activityTypes;
  },

  getManyMigrationCharacters: async ({
    skip,
    take,
    lastVisitedAt,
  }: {
    skip: number;
    take: number;
    lastVisitedAt?: Date;
  }) => {
    const users = await eqdkpRepository(p).getManyUsers({
      skip,
      take,
      lastVisitedAt,
    });
    if (users.length === 0) {
      return null;
    }

    const raceMap = await eqdkpController(p).getRaceMap();
    const classMap = await eqdkpController(p).getClassMap();

    return users.reduce<
      {
        username: string;
        userId: number;
        characterName: string;
        classId?: number;
        raceId?: number;
      }[]
    >((acc, user) => {
      return acc.concat(
        user.user_characters.map(({ character }) => {
          const attributes = profiledataSchema.parse(character.profiledata);
          const characterName = character.member_name.split(" ")[0].trim();
          const raceId = raceMap[attributes.race]?.id;
          const classId = classMap[attributes.class]?.id;
          return {
            username: user.username,
            userId: user.user_id,
            characterName,
            classId,
            raceId,
          };
        }),
      );
    }, []);
  },
});
