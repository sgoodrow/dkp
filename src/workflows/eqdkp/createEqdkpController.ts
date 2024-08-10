import { characterController } from "@/api/controllers/characterController";
import { CharacterClass, CharacterRace } from "@prisma/client";
import { z } from "zod";
import { getPrismaEqdkp } from "@/workflows/eqdkp/prismaEqdkp";
import { eqdkpRepository } from "@/workflows/eqdkp/eqdkpRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";

const profiledataSchema = z.object({
  race: z.union([z.string(), z.number()]),
  class: z.union([z.string(), z.number()]),
});

export const createEqdkpController = ({
  p,
  dbUrl,
}: {
  p: PrismaTransactionClient;
  dbUrl: string;
}) => {
  const client = getPrismaEqdkp({ dbUrl });

  const getRaceMap = async () => {
    const races = await characterController(p).getRaces({});
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
    const classes = await characterController(p).getClasses({});
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
    getManyRaidActivityTypes: async ({
      skip,
      take,
    }: {
      skip: number;
      take: number;
    }) => {
      const activityTypes = await eqdkpRepository(
        client,
      ).getManyRaidActivityTypes({
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
      const users = await eqdkpRepository(client).getManyUsers({
        skip,
        take,
        lastVisitedAt,
      });
      if (users.length === 0) {
        return null;
      }

      const raceMap = await getRaceMap();
      const classMap = await getClassMap();

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
};

export type EqdkpController = ReturnType<typeof createEqdkpController>;
