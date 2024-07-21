import { characterController } from "@/api/controllers/characterController";
import { ENV } from "@/api/env";
import {
  logWorkflowComplete,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const workflowName = "Ingesting characters";

export const ingestCharacters = async ({ userId }: { userId: string }) => {
  logWorkflowStarted(workflowName);

  const characters = [
    { name: "Magus", class: "Magician", race: "Human" },
    { name: "Vijo", class: "Enchanter", race: "Human" },
    { name: "Darky", class: "Necromancer", race: "Dark Elf" },
    { name: "Sparrowhawk", class: "Wizard", race: "Human" },
    { name: "Healion", class: "Cleric", race: "High Elf" },
    { name: "Forest", class: "Druid", race: "Half Elf" },
    { name: "Weteye", class: "Shaman", race: "Troll" },
    { name: "Matil", class: "Bard", race: "Human" },
    { name: "Pumped", class: "Monk", race: "Human" },
    { name: "Aika", class: "Ranger", race: "Wood Elf" },
    { name: "Ghunta", class: "Rogue", race: "Dwarf" },
    { name: "Orval", class: "Paladin", race: "Dwarf" },
    { name: "Shadowtooth", class: "Shadow Knight", race: "Ogre" },
    { name: "Bantam", class: "Warrior", race: "Troll" },
  ];

  await Promise.all(
    characters.map(async (c) =>
      characterController.create({
        name: c.name,
        classId: await characterController.getClassIdByName({ name: c.class }),
        raceId: await characterController.getRaceIdByName({ name: c.race }),
        defaultPilotId: userId,
      }),
    ),
  );

  logWorkflowComplete(workflowName);
};
