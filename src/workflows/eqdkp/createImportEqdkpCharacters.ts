import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { createLogger } from "prisma/dataMigrations/util/log";
import { userController } from "@/api/controllers/userController";
import { characterController } from "@/api/controllers/characterController";
import { character } from "@/shared/utils/character";
import { EqdkpController } from "@/workflows/eqdkp/createEqdkpController";
import { EqdkpService } from "@/workflows/eqdkp/createEqdkpService";

const logger = createLogger("Ingesting EQ DKP characters");

const BATCH_SIZE = 1000;

export const createImportEqdkpCharacters =
  ({
    p,
    eqdkpController,
    eqdkpService,
  }: {
    p: PrismaTransactionClient;
    eqdkpController: EqdkpController;
    eqdkpService: EqdkpService;
  }) =>
  async ({ lastVisitedAt }: { lastVisitedAt?: Date }) => {
    logger.info("Started workflow.");

    const emails: Record<number, string> = {};

    let count = 0;
    let skip = 0;
    do {
      const characters = await eqdkpController().getManyMigrationCharacters({
        lastVisitedAt,
        skip,
        take: BATCH_SIZE,
      });

      if (characters === null) {
        break;
      }
      skip += BATCH_SIZE;
      // TODO: Need to optimize this, it takes way too long to run.
      // 1. Is there a list endpoint for getting user emails in bulk?
      // 2. Can we create many users & characters at once?

      for (const c of characters) {
        count += 1;
        console.log(`Processing character #${count}`);
        const { username, userId, characterName, raceId, classId } = c;
        // Validate race
        if (raceId === undefined) {
          logger.warn(
            `Could not create character because it has no race: ${JSON.stringify(c)}`,
          );
          continue;
        }

        // Validate class
        if (classId === undefined) {
          logger.warn(
            `Could not create character because it has no class: ${JSON.stringify(c)}`,
          );
          continue;
        }

        // Validate race/class combination
        const isAllowedRaceClassCombination = await characterController(
          p,
        ).isAllowedRaceClassCombination({
          raceId,
          classId,
        });
        if (!isAllowedRaceClassCombination) {
          logger.warn(
            `Could not create character because it has an invalid race/class combination: ${JSON.stringify(c)}`,
          );
          continue;
        }

        // Get the user email
        if (emails[userId] === undefined) {
          const user = await eqdkpService.getUserById({ userId });
          emails[userId] = user.email;
        }

        // Upsert the user
        const user = await userController(p).upsert({
          name: username,
          email: emails[userId],
        });

        // Check if the character name is valid
        const isNameValid = character.isValidName(characterName);
        if (!isNameValid) {
          logger.warn(
            `Could not create character because it has an invalid name: ${JSON.stringify(c)}`,
          );
          continue;
        }

        // Create the character if its well-defined
        await characterController(p).upsert({
          name: characterName,
          raceId,
          classId,
          defaultPilotId: user.id,
        });
      }
    } while (true);

    logger.info("Finished workflow.");
  };
