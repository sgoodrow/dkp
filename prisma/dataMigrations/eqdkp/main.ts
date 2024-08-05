import { ENV } from "@/api/env";
import { createLogger } from "prisma/dataMigrations/util/log";
import { ingestEqdkpCharacters } from "prisma/dataMigrations/eqdkp/ingestEqdkpCharacters";

const logger = createLogger("Ingesting EQ DKP data");

export const eqdkpDataMigration = async ({
  lastVisitedAt,
}: {
  lastVisitedAt?: Date;
}) => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await ingestEqdkpCharacters({ lastVisitedAt });
  // await ingestEqdkpRaidActivities();
  // await ingestEqdkpRaidAttendance();
  // await ingestEqdkpAdjustments();
  // await ingestEqdkpPurchases();

  // Look up the character by name if valid
  // const character = isNameValid
  //   ? await characterController(p).getByNameMatch({
  //       search: characterName,
  //     })
  //   : null;

  // Upsert the transaction as an adjustment
  // if (amount !== undefined) {
  //   await walletController(p).createManyAdjustments({
  //     adjustments: [
  //       {
  //         characterName,
  //         pilotCharacterName,
  //         amount,
  //         characterId: character?.id || null,
  //         walletId: user.wallet.id,
  //         reason: `EQ DKP migration`,
  //       },
  //     ],
  //     createdById: adminUser.id,
  //     updatedById: adminUser.id,
  //   });

  //   if (character === null) {
  //     logger.warn(`Created pending transaction for ${characterName}`);
  //   } else {
  //     logger.info(`Created cleared transaction for ${characterName}`);
  //   }
  // }

  logger.info("Finished workflow.");
};
