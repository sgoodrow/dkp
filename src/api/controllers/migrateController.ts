import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { migrateRepository } from "@/api/repositories/migrateRepository";
import { createEqdkpService } from "@/api/services/createEqdkpService";
import { TRPCError } from "@trpc/server";
import { userController } from "@/api/controllers/userController";
import { character } from "@/shared/utils/character";
import { characterController } from "@/api/controllers/characterController";
import { differenceBy, maxBy, uniq } from "lodash";
import { createEqdkpController } from "./createEqdkpController";
import { raidActivityController } from "@/api/controllers/raidActivityController";
import { SECONDS } from "@/shared/constants/time";
import { decode } from "he";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";

const findOrThrow = <T>(items: T[], predicate: (item: T) => boolean) => {
  const item = items.find(predicate);
  if (item === undefined) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not find item",
    });
  }
  return item;
};

export const migrateController = (p?: PrismaTransactionClient) => ({
  restartCharacterMigration: async () => {
    return prisma.$transaction(
      async (p) => {
        await migrateRepository(p).deleteAllCharacters();
        await characterController(p).deleteAllCharacters();
        await migrateRepository(p).update({
          lastMigratedRemoteCharacterId: 0,
        });
      },
      {
        timeout: 10 * SECONDS,
      },
    );
  },

  isValidConnection: async ({
    dbUrl,
    siteUrl,
    siteApiKey,
  }: {
    dbUrl: string;
    siteUrl: string;
    siteApiKey: string;
  }) => {
    const eqdkpController = createEqdkpController({ dbUrl });
    const eqdkpService = createEqdkpService({
      baseUrl: siteUrl,
      apiKey: siteApiKey,
    });
    try {
      const user = await eqdkpController().getFirstUser();
      await eqdkpService.getUserById({
        eqdkpUserId: user.user_id,
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  getOrCreate: async ({ userId }: { userId: string }) => {
    return migrateRepository(p).getOrCreate({ userId });
  },

  getManyInvalidCharacters: async (agGrid: AgGrid) => {
    return {
      totalRowCount: await migrateRepository(p).countInvalidCharacters(agGrid),
      rows: await migrateRepository(p).getManyInvalidCharacters(agGrid),
    };
  },

  getUserBatch: async ({
    userId,
    take,
    siteUrl,
    siteApiKey,
    dbUrl,
  }: {
    userId: string;
    take: number;
    siteUrl: string;
    siteApiKey: string;
    dbUrl: string;
  }) => {
    const attempt = await migrateController(p).getOrCreate({ userId });

    const eqdkpController = createEqdkpController({ dbUrl });

    return {
      batch: await eqdkpController().getManyUsers({
        siteApiKey,
        siteUrl,
        take,
        cursor: attempt.lastMigratedRemoteUserId,
      }),
      count: await userController(p).count(),
      totalCount: await eqdkpController().countUsers(),
    };
  },

  migrateUserBatch: async ({
    batch,
  }: {
    batch: {
      remoteId: number;
      name: string;
      email: string;
    }[];
  }) => {
    const emails = batch.flatMap(({ email }) => (email ? email : []));
    const existing = await userController().getManyByEmails({ emails });
    const missing = differenceBy(batch, existing, ({ email }) => email);

    return prisma.$transaction(async (p) => {
      const created = await userController(p).createManyStubUsers({
        users: missing.map((u) => ({
          email: u.email,
          name: u.name,
        })),
      });

      await migrateRepository(p).createManyUsers({
        users: [...created, ...existing].map(({ id, email }) => ({
          userId: id,
          remoteUserId: findOrThrow(batch, (u) => u.email === email).remoteId,
        })),
      });

      await migrateRepository(p).update({
        lastMigratedRemoteUserId: maxBy(batch, ({ remoteId }) => remoteId)
          ?.remoteId,
      });
    });
  },

  getCharacterBatch: async ({
    userId,
    take,
    dbUrl,
  }: {
    userId: string;
    take: number;
    dbUrl: string;
  }) => {
    const attempt = await migrateController().getOrCreate({ userId });

    const eqdkpController = createEqdkpController({ dbUrl });

    const characters = await eqdkpController().getManyCharacters({
      take,
      cursor: attempt.lastMigratedRemoteCharacterId,
    });

    return {
      batch: characters.map((c) => ({
        remoteId: c.eqdkpId,
        remoteUserId: c.eqdkpUserId,
        name: c.name,
        classId: c.classId,
        raceId: c.raceId,
      })),
      invalidCount: await migrateRepository().countInvalidCharacters({}),
      count: await characterController().count(),
      totalCount: await eqdkpController().countCharacters(),
    };
  },

  migrateCharacterBatch: async ({
    batch,
    botNamesCsv,
  }: {
    batch: {
      remoteId: number;
      remoteUserId?: number;
      name: string;
      classId: number;
      raceId: number;
    }[];
    botNamesCsv: string;
  }) => {
    const botNames = new Set(
      botNamesCsv.split(",").map(character.normalizeName),
    );

    const isDuplicateNormalizedName =
      await characterController().getNameDuplicateValidator({
        names: batch.map(({ name }) => name),
      });

    const owners = await migrateRepository().getManyUsersByRemoteUserIds({
      remoteUserIds: uniq(
        batch.flatMap(({ remoteUserId }) =>
          remoteUserId == undefined ? [] : remoteUserId,
        ),
      ),
    });

    const { valid, invalid } = batch.reduce<{
      valid: {
        name: string;
        remoteId: number;
        classId: number;
        raceId: number;
        defaultPilotId: string | null;
      }[];
      invalid: {
        name: string;
        remoteId: number;
        missingOwner: boolean;
        invalidName: boolean;
        duplicateNormalizedName: boolean;
      }[];
    }>(
      (acc, { remoteId, remoteUserId, name, classId, raceId }) => {
        const owner = owners.find((o) => o.remoteUserId === remoteUserId);
        const missingOwner = owner === undefined;
        const duplicateNormalizedName = isDuplicateNormalizedName(name);
        const invalidOwner = missingOwner && !botNames.has(name);
        const invalidName = !character.isValidName(name);
        const valid = !invalidName && !invalidOwner && !duplicateNormalizedName;
        if (valid) {
          acc.valid.push({
            name,
            remoteId,
            classId,
            raceId,
            defaultPilotId: owner?.userId || null,
          });
        } else {
          acc.invalid.push({
            name,
            remoteId,
            missingOwner,
            duplicateNormalizedName,
            invalidName,
          });
        }
        return acc;
      },
      {
        valid: [],
        invalid: [],
      },
    );

    return prisma.$transaction(async (p) => {
      const created = await characterController(p).createMany({
        characters: valid,
      });

      await migrateRepository(p).createManyCharacters({
        characters: created.map(({ id, name }) => ({
          characterId: id,
          remoteCharacterId: findOrThrow(batch, (c) => c.name === name)
            .remoteId,
        })),
      });

      await migrateRepository(p).createManyInvalidCharacters({
        invalidCharacters: invalid,
      });

      await migrateRepository(p).update({
        lastMigratedRemoteCharacterId: maxBy(
          [...valid, ...invalid],
          (c) => c.remoteId,
        )?.remoteId,
      });
    });
  },

  getRaidActivityTypeBatch: async ({
    userId,
    take,
    dbUrl,
  }: {
    userId: string;
    take: number;
    dbUrl: string;
  }) => {
    const attempt = await migrateController().getOrCreate({ userId });

    const eqdkpController = createEqdkpController({ dbUrl });

    const raidActivityTypes = await eqdkpController().getManyRaidActivityTypes({
      take,
      cursor: attempt.lastMigratedRemoteRaidActivityTypeId,
    });

    return {
      batch: raidActivityTypes.map((t) => ({
        remoteId: t.event_id,
        name: t.event_name,
        defaultPayout: t.event_value,
      })),
      count: await raidActivityController().countTypes({}),
      totalCount: await eqdkpController().countRaidActivityTypes(),
    };
  },

  migrateRaidActivityTypeBatch: async ({
    userId,
    batch,
  }: {
    userId: string;
    batch: {
      remoteId: number;
      name: string;
      defaultPayout: number;
    }[];
  }) => {
    return prisma.$transaction(async (p) => {
      const created = await raidActivityController(p).createManyTypes({
        types: batch.map((t) => ({
          name: t.name,
          defaultPayout: t.defaultPayout,
        })),
        createdById: userId,
      });

      await migrateRepository(p).createManyRaidActivityTypes({
        raidActivityTypes: created.map(({ id, name }) => ({
          raidActivityTypeId: id,
          remoteRaidActivityTypeId: findOrThrow(batch, (t) => t.name === name)
            .remoteId,
        })),
      });

      await migrateRepository(p).update({
        lastMigratedRemoteRaidActivityTypeId: maxBy(batch, (t) => t.remoteId)
          ?.remoteId,
      });
    });
  },

  getRaidActivitiesBatch: async ({
    userId,
    take,
    dbUrl,
  }: {
    userId: string;
    take: number;
    dbUrl: string;
  }) => {
    const attempt = await migrateController().getOrCreate({ userId });

    const eqdkpController = createEqdkpController({ dbUrl });

    const raidActivities = await eqdkpController().getManyRaidActivities({
      take,
      cursor: attempt.lastMigratedRemoteRaidActivityId,
    });

    return {
      batch: raidActivities.map((r) => ({
        remoteId: r.raid_id,
        remoteTypeId: r.event_id,
        createdAt: new Date(r.raid_date * SECONDS).toISOString(),
        payout: r.raid_value,
        note: r.raid_note || undefined,
        attendees: r.attendees.map((a) => ({
          remoteCharacterId: a.member_id,
        })),
        adjustments: r.adjustments.map((a) => ({
          createdAt: new Date(a.adjustment_date * SECONDS).toISOString(),
          remoteCharacterId: a.member_id,
          amount: a.adjustment_value,
          reason: a.adjustment_reason,
        })),
        purchases: r.purchases.map((p) => ({
          createdAt: new Date(p.item_date * SECONDS).toISOString(),
          remoteCharacterId: p.member_id,
          itemName: p.item_name,
          amount: p.item_value,
        })),
      })),
      count: await raidActivityController().count({}),
      totalCount: await eqdkpController().countRaidActivities(),
    };
  },

  migrateRaidActivitiesBatch: async ({
    userId,
    batch,
  }: {
    userId: string;
    batch: {
      remoteId: number;
      remoteTypeId: number;
      createdAt: string;
      payout: number;
      note?: string;
      attendees: {
        remoteCharacterId: number;
      }[];
      adjustments: {
        createdAt: string;
        remoteCharacterId: number;
        amount: number;
        reason: string;
      }[];
      purchases: {
        createdAt: string;
        remoteCharacterId: number;
        itemName: string;
        amount: number;
      }[];
    }[];
  }) => {
    // In rare circumstances, we encounter cases where the raid activity type has an ID of 0, signifying
    // that the transactions were not associated with a raid activity. This may occur if the migrated
    // system allows transactions to be directly associated with a user. In these cases, we use a fallback
    // raid activity type.
    const fallback = await raidActivityController(p).upsertTypeByName({
      name: "Migration Transactions without Raid Activities",
      defaultPayout: 0,
      userId,
    });
    await migrateRepository(p).upsertRaidActivityTypeById({
      raidActivityTypeId: fallback.id,
      remoteRaidActivityTypeId: 0,
    });

    const remoteCharacterIds = uniq(
      batch.flatMap((b) => [
        ...b.adjustments.map((a) => a.remoteCharacterId),
        ...b.purchases.map((p) => p.remoteCharacterId),
        ...b.attendees.map((a) => a.remoteCharacterId),
      ]),
    );
    const characterIds =
      await migrateRepository().getManyCharactersByRemoteCharacterIds({
        remoteCharacterIds,
      });
    const characters = await characterController().getManyByIds({
      ids: characterIds.map((c) => c.characterId),
    });
    const charactersMap = characterIds.reduce<
      Record<
        number,
        {
          name: string;
          id: number;
          defaultPilot: { wallet: { id: number } | null } | null;
        }
      >
    >((acc, { remoteCharacterId, characterId }) => {
      const c = characters.find((c) => c.id === characterId);
      if (c) {
        acc[remoteCharacterId] = c;
      }
      return acc;
    }, {});

    const remoteRaidActivityTypeIds = uniq(batch.map((b) => b.remoteTypeId));
    const raidActivityTypeIds =
      await migrateRepository().getManyRaidActivityTypesByRemoteRaidActivityTypeIds(
        { remoteRaidActivityTypeIds },
      );

    return prisma.$transaction(async (p) => {
      await raidActivityController(p).createMany({
        activities: batch.map(
          ({
            remoteTypeId,
            createdAt,
            note,
            payout,
            attendees,
            purchases,
            adjustments,
          }) => {
            return {
              typeId: findOrThrow(
                raidActivityTypeIds,
                (t) => t.remoteRaidActivityTypeId === remoteTypeId,
              ).raidActivityTypeId,
              createdAt,
              payout: payout,
              note: note,
              attendees: attendees
                .map(({ remoteCharacterId }) => {
                  const c = charactersMap[remoteCharacterId];
                  return {
                    characterName: c?.name || `Remote ${remoteCharacterId}`,
                    characterId: c?.id || null,
                    walletId: c?.defaultPilot?.wallet?.id || null,
                    createdAt,
                  };
                })
                .filter((a) => a.characterId !== null),
              purchases: purchases
                .map(({ itemName, amount, remoteCharacterId, createdAt }) => {
                  const c = charactersMap[remoteCharacterId];
                  return {
                    characterName: c?.name || `Remote ${remoteCharacterId}`,
                    characterId: c?.id || null,
                    walletId: c?.defaultPilot?.wallet?.id || null,
                    amount,
                    itemName: decode(itemName),
                    createdAt,
                  };
                })
                .filter((p) => p.characterId !== null),
              adjustments: adjustments
                .map(({ amount, createdAt, reason, remoteCharacterId }) => {
                  const c = charactersMap[remoteCharacterId];
                  return {
                    characterName: c?.name || `Remote ${remoteCharacterId}`,
                    characterId: c?.id || null,
                    walletId: c?.defaultPilot?.wallet?.id || null,
                    amount,
                    reason,
                    createdAt,
                  };
                })
                .filter((a) => a.characterId !== null),
            };
          },
        ),
        userId,
      });

      await migrateRepository(p).update({
        lastMigratedRemoteRaidActivityId: maxBy(batch, (r) => r.remoteId)
          ?.remoteId,
      });
    });
  },
});
