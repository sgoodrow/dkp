import { characterController } from "@/api/controllers/characterController";
import { eqdkpRepository } from "@/api/repositories/eqdkpRepository";
import { getPrismaEqdkp } from "@/api/repositories/shared/prismaEqdkp";
import { createEqdkpService } from "@/api/services/createEqdkpService";
import { character } from "@/shared/utils/character";
import { CharacterClass, CharacterRace } from "@prisma/client";
import { z } from "zod";

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
      take,
      cursor,
    }: {
      take: number;
      cursor: number | null;
    }) => {
      return eqdkpRepository(client).getManyRaidActivityTypes({
        cursor,
        take,
      });
    },

    getManyUsers: async ({
      siteUrl,
      siteApiKey,
      take,
      cursor,
    }: {
      siteUrl: string;
      siteApiKey: string;
      take: number;
      cursor: number | null;
    }) => {
      const users = await eqdkpRepository(client).getManyUsers({
        take,
        cursor,
      });

      const eqdkpService = createEqdkpService({
        baseUrl: siteUrl,
        apiKey: siteApiKey,
      });

      // Emails are used to identify users; since they are encrypted in the EQ DKP Database, we need
      // to query them via the REST API.
      const remoteUsers = await Promise.all(
        users.map(({ user_id: eqdkpUserId }) =>
          eqdkpService.getUserById({ eqdkpUserId }),
        ),
      );

      return remoteUsers.map((u) => ({
        remoteId: Number(u.user_id),
        name: u.username,
        email: u.email,
      }));
    },

    countUsers: async () => {
      return eqdkpRepository(client).countUsers();
    },

    countCharacters: async () => {
      return eqdkpRepository(client).countCharacters();
    },

    countRaidActivityTypes: async () => {
      return eqdkpRepository(client).countRaidActivityTypes();
    },

    countRaidActivities: async () => {
      return eqdkpRepository(client).countRaidActivities();
    },

    getManyCharacters: async ({
      take,
      cursor,
    }: {
      take: number;
      cursor: number | null;
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
        cursor,
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
            eqdkpUserId: userCharacter?.user_id,
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

    getManyRaidActivities: async ({
      take,
      cursor,
    }: {
      take: number;
      cursor: number | null;
    }) => {
      const activities = await eqdkpRepository(client).getManyRaidActivities({
        take,
        cursor,
      });

      // EQ DKP Plus creates some adjustments on a phantom raid activity with id "0, such as those generated
      // by consolidation events. We include them in the first batch.
      if (cursor === null) {
        activities.push({
          event_id: 0,
          raid_id: 0,
          raid_date: Date.now() / 1000,
          raid_note:
            "These adjustments were migrated from EQ DKP Plus. There, they were not associated with any raid activity, which made them difficult to find.",
          raid_value: 0,
          attendees: [],
          purchases: [],
          adjustments:
            await eqdkpRepository(
              client,
            ).getAllAdjustmentsWithoutRaidActivities(),
        });
      }

      return activities;
    },
  });
};

export type EqdkpController = ReturnType<typeof createEqdkpController>;
