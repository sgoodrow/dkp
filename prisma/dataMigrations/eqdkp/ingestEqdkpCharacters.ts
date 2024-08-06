import { prisma } from "@/api/repositories/shared/prisma";
import { eqdkpController } from "prisma/dataMigrations/eqdkp/eqdkpController";
import { createLogger } from "prisma/dataMigrations/util/log";
import { eqdkpService } from "prisma/dataMigrations/eqdkp/eqdkpService";
import { userController } from "@/api/controllers/userController";
import { characterController } from "@/api/controllers/characterController";
import { character } from "@/shared/utils/character";

const logger = createLogger("Ingesting EQ DKP characters");

const BATCH_SIZE = 1000;

export const ingestEqdkpCharacters = async ({
  lastVisitedAt,
}: {
  lastVisitedAt?: Date;
}) => {
  logger.info("Started workflow.");

  const emails: Record<number, string> = {};

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

    for (const c of characters) {
      const { username, userId, characterName, raceId, classId } = c;
      await prisma.$transaction(async (p) => {
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

        // Create the character if its well-defined
        if (raceId !== undefined && classId !== undefined && isNameValid) {
          const character = await characterController(p).upsert({
            name: characterName,
            raceId,
            classId,
            defaultPilotId: user.id,
          });
          logger.info(
            `Upserted character ${character.name} from ${characterName} for user ${user.email}`,
          );
        } else {
          logger.warn(
            `Could not create character because it is not well-defined: ${JSON.stringify(c)}`,
          );
        }
      });
    }
  } while (true);

  logger.info("Finished workflow.");
};
