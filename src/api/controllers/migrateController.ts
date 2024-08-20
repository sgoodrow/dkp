import { decode } from "he";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import {
  CreateMigrateAttempt,
  migrateRepository,
} from "@/api/repositories/migrateRepository";
import { createEqdkpService } from "@/api/services/createEqdkpService";
import { TRPCError } from "@trpc/server";
import { userController } from "@/api/controllers/userController";
import { processManyInBatches } from "prisma/dataMigrations/util/batch";
import { character } from "@/shared/utils/character";
import { characterController } from "@/api/controllers/characterController";
import {
  MigrateCharacter,
  MigrateCharacterInvalid,
  MigrateCharacterValid,
  MigrateSummary,
} from "@/shared/types/migrateTypes";
import { differenceBy, keyBy, mapValues, partition } from "lodash";
import { raidActivityController } from "@/api/controllers/raidActivityController";
import { createEqdkpController } from "./createEqdkpController";
import { MINUTES, SECONDS } from "@/shared/constants/time";
import { installController } from "@/api/controllers/installController";

const getPreparationState = ({
  count,
  countWithEmails,
}: {
  count: number;
  countWithEmails: number;
}) => {
  if (count === 0) {
    return "NOT_STARTED" as const;
  }
  if (countWithEmails === count) {
    return "DONE" as const;
  }
  return "PREPARING" as const;
};

class DryRunSuccess extends Error {
  constructor() {
    super();
    this.name = "Dry Run Success";
  }
}

const ingestStubUsers = async ({ p }: { p: PrismaTransactionClient }) =>
  processManyInBatches({
    batchSize: 1000,
    get: migrateRepository(p).getManyUsersWithEmails,
    process: async (batch) => {
      const emails = batch.flatMap(({ email }) => (email ? email : []));
      const ignored = await userController(p).getManyByEmails({ emails });
      const created = await userController(p).createManyStubUsers({
        users: differenceBy(batch, ignored, ({ email }) => email).map((u) => ({
          email: u.email,
          name: u.name,
        })),
      });
      const getEqdkpId = (email: string) => {
        const match = batch.find((u) => u.email === email);
        if (match === undefined) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Could not find user with email ${email}`,
          });
        }
        return match.eqdkpUserId;
      };
      const getWalletId = (email: string, wallet: { id: number } | null) => {
        if (wallet === null) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Could not find wallet for email ${email}`,
          });
        }
        return wallet.id;
      };
      return [...ignored, ...created].map(({ id, email, wallet }) => ({
        id,
        eqdkpId: getEqdkpId(email),
        walletId: getWalletId(email, wallet),
      }));
    },
  });

const ingestCharacters = async ({
  p,
  dbUrl,
  users,
  botNames,
}: {
  p: PrismaTransactionClient;
  dbUrl: string;
  users: { id: string; eqdkpId: number; walletId: number }[];
  botNames: string[];
}) => {
  const ownerMap = mapValues(
    keyBy(users, ({ eqdkpId }) => eqdkpId || -1),
    ({ id, walletId }) => ({ id, walletId }),
  );

  const namesSeen: Record<string, number> = {};
  const namesAllowedNoOwner = new Set(
    botNames.map((name) => character.normalizeName(name)),
  );

  const eqdkpController = createEqdkpController({ dbUrl });

  const isCharacterValid = await characterController().getCharacterValidator();

  return processManyInBatches({
    batchSize: 1000,
    get: eqdkpController().getManyCharacters,
    process: async (batch): Promise<MigrateCharacter[]> => {
      batch.forEach(({ name }) => {
        namesSeen[name] = (namesSeen[name] || 0) + 1;
      });
      const all = batch.map<MigrateCharacterInvalid | MigrateCharacterValid>(
        ({ eqdkpId, eqdkpUserId, name, classId, raceId }) => {
          const owner = ownerMap[eqdkpUserId];
          const missingOwner = owner === undefined;
          const invalidOwner = missingOwner && !namesAllowedNoOwner.has(name);
          const invalidName = !character.isValidName(name);
          const duplicateNormalizedName = namesSeen[name] > 1;
          const invalidRaceClassCombination = !isCharacterValid({
            classId,
            raceId,
          });
          const valid =
            !invalidName &&
            !invalidRaceClassCombination &&
            !invalidOwner &&
            !duplicateNormalizedName;
          return valid
            ? {
                valid,
                id: 1,
                name,
                eqdkpId,
                classId,
                raceId,
                defaultPilotId: owner?.id || null,
                walletId: owner?.walletId || null,
              }
            : {
                valid,
                name,
                eqdkpId,
                missingOwner,
                duplicateNormalizedName,
                invalidName,
                invalidRaceClassCombination,
              };
        },
      );

      const valid = all.flatMap((c) => (c.valid ? [c] : []));
      const invalid = all.flatMap((c) => (c.valid ? [] : [c]));

      const created = await characterController(p).createMany({
        characters: valid,
      });

      const getId = (name: string) => {
        const match = created.find(({ name: n }) => n === name);
        if (match === undefined) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Could not find character with name ${name}`,
          });
        }
        return match.id;
      };

      const validWithIds = valid.map<MigrateCharacterValid>((c) => ({
        ...c,
        id: getId(c.name),
      }));

      return [...invalid, ...validWithIds];
    },
  });
};

const ingestRaidActivityTypes = async ({
  p,
  dbUrl,
  userId,
}: {
  p: PrismaTransactionClient;
  dbUrl: string;
  userId: string;
}) => {
  const eqdkpController = createEqdkpController({ dbUrl });
  return processManyInBatches({
    batchSize: 1000,
    get: eqdkpController().getManyRaidActivityTypes,
    process: async (batch) => {
      const created = await raidActivityController(p).createManyTypes({
        types: batch.map(({ event_name, event_value }) => ({
          name: event_name,
          defaultPayout: event_value,
        })),
        createdById: userId,
      });

      const getEqdkpId = (name: string) => {
        const match = batch.find(({ event_name }) => event_name === name);
        if (match === undefined) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Could not find raid activity type with name ${name}`,
          });
        }
        return match.event_id;
      };

      return created.map(({ id, name }) => ({
        id,
        eqdkpId: getEqdkpId(name),
      }));
    },
  });
};

const ingestRaidActivities = async ({
  p,
  dbUrl,
  characters,
  raidActivityTypes,
  userId,
}: {
  p: PrismaTransactionClient;
  dbUrl: string;
  characters: MigrateCharacter[];
  raidActivityTypes: { id: number; eqdkpId: number }[];
  userId: string;
}) => {
  const eqdkpController = createEqdkpController({ dbUrl });

  const charactersIdMap = keyBy(characters, (c) => c.eqdkpId);
  const raidActivityTypesIdMap = keyBy(raidActivityTypes, (t) => t.eqdkpId);

  const getTypeId = ({ eqdkpEventId }: { eqdkpEventId: number }) => {
    const match = raidActivityTypesIdMap[eqdkpEventId];
    if (match === undefined) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Could not find raid activity type with eqdkp id ${eqdkpEventId}`,
      });
    }
    return match.id;
  };

  const migrationRaidActivity = await raidActivityController(p).upsertType({
    name: "Migration Adjustments without Raid Activities",
    defaultPayout: 0,
    createdById: userId,
    updatedById: userId,
  });

  await processManyInBatches({
    batchSize: 1000,
    get: eqdkpController().getManyAdjustmentsWithoutRaidActivities,
    process: async (batch) => {
      await raidActivityController(p).createMany({
        activities: [
          {
            typeId: migrationRaidActivity.id,
            createdAt: new Date().toISOString(),
            payout: 0,
            note: "These adjustments were migrated from EQ DKP Plus. There, they were not associated with any raid activity, which made them difficult to find.",
            adjustments: batch
              .map(
                ({
                  member_id,
                  adjustment_value,
                  adjustment_reason,
                  adjustment_date,
                }) => {
                  const c = charactersIdMap[member_id];
                  return {
                    characterName: c?.name || `${member_id}`,
                    characterId: c?.valid ? c.id : null,
                    walletId: c?.valid ? c.walletId : null,
                    amount: adjustment_value,
                    reason: adjustment_reason,
                    createdAt: new Date(
                      adjustment_date * SECONDS,
                    ).toISOString(),
                  };
                },
              )
              .filter((a) => a.characterId !== null),
            attendees: [],
            purchases: [],
          },
        ],
        userId,
      });
      return [];
    },
  });

  return processManyInBatches({
    batchSize: 1000,
    get: eqdkpController().getManyRaidActivities,
    process: async (batch) => {
      return raidActivityController(p).createMany({
        userId,
        activities: batch.map(
          ({
            event_id,
            raid_date,
            raid_note,
            raid_value,
            attendees,
            purchases,
            adjustments,
          }) => {
            const createdAt = new Date(raid_date * SECONDS).toISOString();
            return {
              typeId: getTypeId({ eqdkpEventId: event_id }),
              createdAt,
              payout: raid_value,
              note: raid_note,
              attendees: attendees
                .map(({ member_id }) => {
                  const c = charactersIdMap[member_id];
                  return {
                    characterName: c?.name || `${member_id}`,
                    characterId: c?.valid ? c.id : null,
                    walletId: c?.valid ? c.walletId : null,
                    createdAt,
                  };
                })
                .filter((a) => a.characterId !== null),
              purchases: purchases
                .map(({ item_name, item_value, member_id, item_date }) => {
                  const c = charactersIdMap[member_id];
                  return {
                    characterName: c?.name || `${member_id}`,
                    characterId: c?.valid ? c.id : null,
                    walletId: c?.valid ? c.walletId : null,
                    amount: item_value,
                    itemName: decode(item_name),
                    createdAt: new Date(item_date * SECONDS).toISOString(),
                  };
                })
                .filter((p) => p.characterId !== null),
              adjustments: adjustments
                .map(
                  ({
                    adjustment_value,
                    adjustment_reason,
                    member_id,
                    adjustment_date,
                  }) => {
                    const c = charactersIdMap[member_id];
                    return {
                      characterName: c?.name || `${member_id}`,
                      characterId: c?.valid ? c.id : null,
                      walletId: c?.valid ? c.walletId : null,
                      amount: adjustment_value,
                      reason: adjustment_reason,
                      createdAt: new Date(
                        adjustment_date * SECONDS,
                      ).toISOString(),
                    };
                  },
                )
                .filter((a) => a.characterId !== null),
            };
          },
        ),
      });
    },
  });
};

export const migrateController = (p?: PrismaTransactionClient) => ({
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

  initializeUsers: async ({ dbUrl }: { dbUrl: string }) => {
    const eqdkpController = createEqdkpController({ dbUrl });

    return prisma.$transaction(
      async (p) =>
        processManyInBatches({
          batchSize: 1000,
          get: eqdkpController().getManyUsers,
          process: async (users) => {
            return migrateRepository(p).createUsers({
              users: users.map((u) => ({
                name: u.name,
                eqdkpUserId: Number(u.user_id),
                currentDkp:
                  u.attendance_total + u.adjustment_total - u.purchase_total,
              })),
            });
          },
        }),
      {
        timeout: 1 * MINUTES,
      },
    );
  },

  getPreparationBatch: async ({ take }: { take: number }) => {
    const users = await migrateRepository(p).getManyUsersWithoutEmails({
      take,
    });
    const count = await migrateRepository(p).getUsersCount();
    const countWithEmails =
      await migrateRepository(p).getUsersCountWithEmails();
    return {
      users,
      status: {
        state: getPreparationState({ count, countWithEmails }),
        count,
        countWithEmails,
        countWithoutEmails: count - countWithEmails,
      },
    };
  },

  prepareUserBatch: async ({
    siteUrl,
    siteApiKey,
    batch,
  }: {
    siteUrl: string;
    siteApiKey: string;
    batch: { id: number; eqdkpUserId: number; currentDkp: number }[];
  }) => {
    const eqdkpService = createEqdkpService({
      baseUrl: siteUrl,
      apiKey: siteApiKey,
    });
    const eqdkpUsers = await Promise.all(
      batch.map((u) =>
        eqdkpService.getUserById(u).then(({ email, username }) => ({
          email,
          id: u.id,
          name: username,
          currentDkp: u.currentDkp,
          eqdkpUserId: u.eqdkpUserId,
        })),
      ),
    );
    await migrateRepository(p).prepareUsers({ users: eqdkpUsers });
    return {
      countWithEmails: await migrateRepository(p).getUsersCountWithEmails(),
    };
  },

  getLatest: async () => {
    return migrateRepository(p).getLatest();
  },

  getDryRun: async ({
    dbUrl,
    userId,
    botNamesCsv,
  }: {
    dbUrl: string;
    userId: string;
    botNamesCsv: string;
  }) => {
    return migrateController().start({
      dryRun: true,
      dbUrl,
      userId,
      botNamesCsv,
    });
  },

  start: async ({
    dbUrl,
    dryRun,
    userId,
    botNamesCsv,
  }: {
    dbUrl: string;
    dryRun: boolean;
    userId: string;
    botNamesCsv: string;
  }) => {
    // Check if already installed
    const latest = await migrateRepository().getLatest();
    if (latest?.status === "COMPLETE") {
      throw new TRPCError({ code: "CONFLICT", message: "Already migrated" });
    }

    // Check that there are prepared users and they all have emails
    const count = await migrateRepository().getUsersCount();
    if (count === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No prepared users" });
    }
    const countWithEmails = await migrateRepository().getUsersCountWithEmails();
    if (countWithEmails !== count) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Not all users are prepared",
      });
    }

    const outcomes: MigrateSummary = {
      users: [],
      characters: [],
      raidActivityTypes: [],
      raidActivities: [],
    };

    // Start migration
    const data: Partial<CreateMigrateAttempt> = {};

    // This nested try/catch ensures that dry runs are not committed to the DB, but also
    // do not appear as failed runs or function executions.
    try {
      await prisma.$transaction(
        async (p) => {
          try {
            // Users
            outcomes.users = await ingestStubUsers({ p });
            data.importedUsers = true;

            // Characters
            outcomes.characters = await ingestCharacters({
              p,
              dbUrl,
              users: outcomes.users,
              botNames: botNamesCsv.split(",").map(character.normalizeName),
            });
            data.importedCharacters = true;

            // Raid Activity Types
            outcomes.raidActivityTypes = await ingestRaidActivityTypes({
              p,
              dbUrl,
              userId,
            });
            data.importedRaidActivityTypes = true;

            // Raid Activities
            outcomes.raidActivities = await ingestRaidActivities({
              p,
              dbUrl,
              characters: outcomes.characters,
              raidActivityTypes: outcomes.raidActivityTypes,
              userId,
            });
            data.importedRaidActivities = true;

            await installController(p).complete({ userId });

            if (dryRun) {
              throw new DryRunSuccess();
            }

            await migrateRepository().create({
              ...data,
              createdById: userId,
              status: "COMPLETE",
            });
          } catch (err) {
            await migrateRepository(dryRun ? p : undefined).create({
              ...data,
              createdById: userId,
              status: "FAIL",
              error: String(err),
            });
            throw err;
          }
        },
        {
          timeout: 5 * MINUTES,
        },
      );
    } catch (err) {
      if (!(err instanceof DryRunSuccess)) {
        throw err;
      }
    }

    return { data, outcomes };
  },
});
