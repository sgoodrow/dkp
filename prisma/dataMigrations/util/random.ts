import { YEARS } from "@/shared/constants/time";
import { random, range, sample, sampleSize } from "lodash";
import {
  knownCharacterNames,
  unknownCharacterNames,
  botCharacterNames,
} from "prisma/dataMigrations/testdata/ingestTestCharacters";

const randomString = (minLength: number, maxLength: number) => {
  const length = random(minLength, maxLength);
  return sampleSize(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    length,
  ).join("");
};

const getRandomDate = (maxAgeYears: number) => {
  return new Date(Date.now() - random(0, YEARS * maxAgeYears));
};

export const getRandomRaidActivity = ({
  raidActivityTypes,
}: {
  raidActivityTypes: { id: number; name: string }[];
}) => {
  const randomType = getSample(raidActivityTypes);
  return {
    typeId: randomType.id,
    createdAt: getRandomDate(5).toISOString(),
    note: randomString(10, 100),
    adjustments: getRandomAdjustments({
      count: random(3, 5),
    }),
    attendees: getRandomAttendees({
      count: random(40, 115),
    }),
    purchases: [],
  };
};

const getSample = <T>(arr: T[]) => {
  const result = sample(arr);
  if (result === undefined) {
    throw new Error("Cannot get a random sample from an empty array.");
  }
  return result;
};

const getRandomCharacterNames = () => {
  const isBot = Math.random() < 0.1;
  const roll = Math.random();

  // It's a bot character 10% of the time
  if (isBot) {
    return {
      characterName: getSample(botCharacterNames),
      // It gets an unknown pilot 33% of the time and undefined 33% of the time
      pilotCharacterName:
        roll < 0.33
          ? getSample(unknownCharacterNames)
          : roll < 0.66
            ? getSample(knownCharacterNames)
            : undefined,
    };
  }

  return {
    // It gets an unknown character name 10% of the time
    characterName:
      roll < 0.1
        ? getSample(unknownCharacterNames)
        : getSample(knownCharacterNames),
    // It gets an unknown pilot 33% of the time and undefined 33% of the time
    pilotCharacterName:
      roll < 0.33
        ? getSample(unknownCharacterNames)
        : roll < 0.66
          ? getSample(knownCharacterNames)
          : undefined,
  };
};

export const getRandomAdjustments = ({ count }: { count: number }) => {
  return range(count).map(() => ({
    amount: random(1, 5),
    reason: randomString(5, 40),
    ...getRandomCharacterNames(),
  }));
};

export const getRandomAttendees = ({ count }: { count: number }) => {
  return range(count).map(() => ({
    ...getRandomCharacterNames(),
  }));
};
