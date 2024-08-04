import { characterController } from "@/api/controllers/characterController";
import { eqdkpController } from "prisma/dataMigrations/eqdkp/eqdkpController";
import {
  ClassMap,
  RaceMap,
} from "prisma/dataMigrations/eqdkp/getCharacterAttributesMap";
import { createLogger } from "prisma/dataMigrations/util/log";
import { z } from "zod";

const BATCH_SIZE = 1000;

const logger = createLogger("Ingesting EQ DKP characters");

const profiledataSchema = z.object({
  race: z.union([z.string(), z.number()]),
  class: z.union([z.string(), z.number()]),
});

const logIgnored = ({
  ignored,
  reason,
}: {
  ignored: {
    wallet: {
      current: number;
    } | null;
  } & {
    member_name: string;
    profiledata: any;
  };
  reason: string;
}) => {
  logger.warn(
    `Ignoring ${ignored.member_name} (dkp: ${ignored.wallet?.current}): ${reason}.`,
  );
  return null;
};

type CharacterToIngest = {
  characterName: string;
  pilotCharacterName: string;
  amount: number;
  classId: number;
  raceId: number;
};

export const ingestEqdkpCharacters = async ({
  classMap,
  raceMap,
}: {
  classMap: ClassMap;
  raceMap: RaceMap;
}) => {
  logger.info("Started workflow.");

  let skip = 0;
  do {
    const eqdkpUsers = await eqdkpController().getManyUsers({
      skip,
      take: BATCH_SIZE,
    });

    if (eqdkpUsers.length === 0) {
      break;
    }

    // TODO: can we merge characters w/ the same name if they also have the same race/class?
    // TODO: can we default unknown race and class to some default combination?
    const names = new Set<string>();

    // ingest the user's characters, wallets (single adjustment), etc
    // create a transaction where the pilot character name is the eqdkp user name, and the character is the character, and the amount is the amount
    // then someone can claim that character and transaction becomes theirs, and we can verify by comparing the pilot character name to their discord name
    const transactions = eqdkpUsers.reduce<(CharacterToIngest | null)[]>(
      (acc, user) => {
        const characters = user.user_characters.map(({ character }) => {
          const attributes = profiledataSchema.parse(character.profiledata);
          const characterName = character.member_name.split(" ")[0];
          if (names.has(characterName)) {
            return logIgnored({
              ignored: character,
              reason: "character name is not unique",
            });
          }
          if (!/^[a-zA-Z]*$/.test(characterName)) {
            return logIgnored({
              ignored: character,
              reason: "character name is not all alphabetic characters",
            });
          }
          const classId = classMap[attributes.class]?.id;
          if (classId === undefined) {
            return logIgnored({
              ignored: character,
              reason: "no class found for character",
            });
          }
          const raceId = raceMap[attributes.race]?.id;
          if (raceId === undefined) {
            return logIgnored({
              ignored: character,
              reason: "no race found for character",
            });
          }
          const amount = character.wallet?.current;
          if (amount === undefined) {
            return logIgnored({
              ignored: character,
              reason: "no wallet found for character",
            });
          }
          names.add(characterName);
          return {
            characterName,
            pilotCharacterName: user.username,
            amount,
            classId,
            raceId,
          };
        });
        return acc.concat(characters);
      },
      [],
    );

    const cleaned = transactions.reduce<CharacterToIngest[]>((acc, c) => {
      if (c !== null) {
        acc.push(c);
      }
      return acc;
    }, []);

    characterController().createMany({
      characters: cleaned.map((t) => ({
        name: t.characterName,
        defaultPilotId: undefined,
        classId: t.classId,
        raceId: t.raceId,
      })),
    });

    skip += BATCH_SIZE;
  } while (true);

  logger.info("Finished workflow.");
};
