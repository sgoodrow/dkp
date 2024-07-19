import { characterController } from "@/api/controllers/characterController";
import { userController } from "@/api/controllers/userController";
import { ENV } from "@/api/env";
import {
  logWorkflowComplete,
  logWorkflowMessage,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const email = ENV.DEV_USER_EMAIL;
if (!email) {
  throw new Error("Cannot seed the database. Set DEV_USER_EMAIL.");
}

const workflowName = "Test data data migration";

export const testDataDataMigration = async () => {
  logWorkflowStarted(workflowName);
  logWorkflowMessage(
    workflowName,
    `Targeting ${ENV.POSTGRES_DATABASE} database`,
  );

  const user = await userController.getByEmail({ email });
  if (!user?.id) {
    throw new Error(
      `Cannot seed the database. There is no user in the database with the email ${email}. Did you forget to log in?`,
    );
  }

  const userId = user.id;

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
