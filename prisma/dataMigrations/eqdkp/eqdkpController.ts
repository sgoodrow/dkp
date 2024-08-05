import { characterController } from "@/api/controllers/characterController";
import { CharacterClass, CharacterRace } from "@prisma/client";
import { lowerCase } from "lodash";
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
      const r = races.find((r) => lowerCase(r.name) === lowerCase(name));
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
      const c = classes.find((c) => lowerCase(c.name) === lowerCase(name));
      acc[id] = c || null;
      return acc;
    }, {});
  },

  getManyMigrationCharacters: async ({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }) => {
    const users = await eqdkpRepository(p).getManyUsers({ skip, take });
    if (users.length === 0) {
      return null;
    }

    const raceMap = await eqdkpController(p).getRaceMap();
    const classMap = await eqdkpController(p).getClassMap();

    return users.reduce<
      {
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
