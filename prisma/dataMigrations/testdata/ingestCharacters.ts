import { characterController } from "@/api/controllers/characterController";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting characters");

const knownCharacters = [
  { name: "Magus", class: "Magician", race: "Human" },
  { name: "Vijo", class: "Enchanter", race: "Human" },
  { name: "Darky", class: "Necromancer", race: "Dark Elf" },
  { name: "Sparrowhawk", class: "Wizard", race: "Human" },
  { name: "Healion", class: "Cleric", race: "High Elf" },
  { name: "Forest", class: "Druid", race: "Half Elf" },
  { name: "Weteye", class: "Shaman", race: "Troll" },
];

const botCharacters = [
  { name: "Matil", class: "Bard", race: "Human" },
  { name: "Pumped", class: "Monk", race: "Human" },
  { name: "Aika", class: "Ranger", race: "Wood Elf" },
  { name: "Ghunta", class: "Rogue", race: "Dwarf" },
  { name: "Orval", class: "Paladin", race: "Dwarf" },
  { name: "Shadowtooth", class: "Shadow Knight", race: "Ogre" },
  { name: "Bantam", class: "Warrior", race: "Troll" },
];

export const knownCharacterNames = knownCharacters.map((c) => c.name);

export const unknownCharacterNames = [
  "Potatus",
  "Mortatus",
  "Squid",
  "Bob",
  "Derbadger",
  "Jairn",
  "Edwina",
];

export const botCharacterNames = botCharacters.map((c) => c.name);

export const ingestCharacters = async ({ userId }: { userId: string }) => {
  logger.info("Started workflow.");

  await Promise.all(
    knownCharacters.map(async (c) =>
      characterController().create({
        name: c.name,
        classId: await characterController().getClassIdByName({
          name: c.class,
        }),
        raceId: await characterController().getRaceIdByName({ name: c.race }),
        defaultPilotId: userId,
      }),
    ),
  );

  await Promise.all(
    botCharacters.map(async (c) =>
      characterController().create({
        name: c.name,
        classId: await characterController().getClassIdByName({
          name: c.class,
        }),
        raceId: await characterController().getRaceIdByName({ name: c.race }),
      }),
    ),
  );

  logger.info("Finished workflow.");
};
