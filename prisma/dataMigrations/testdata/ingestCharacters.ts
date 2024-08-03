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
  { name: "Grim", class: "Warrior", race: "Ogre" },
  { name: "Zephyr", class: "Monk", race: "Human" },
  { name: "Thorne", class: "Rogue", race: "Half Elf" },
  { name: "Lumina", class: "Paladin", race: "High Elf" },
  { name: "Grimlock", class: "Rogue", race: "Dwarf" },
  { name: "Sylvana", class: "Ranger", race: "Wood Elf" },
  { name: "Azura", class: "Wizard", race: "Erudite" },
  { name: "Korg", class: "Warrior", race: "Barbarian" },
  { name: "Seraphina", class: "Bard", race: "Human" },
  { name: "Zorn", class: "Necromancer", race: "Iksar" },
  { name: "Elara", class: "Magician", race: "Gnome" },
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

export const unknownCharacterNames = ["Squid", "Bob", "Edwina"];

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
