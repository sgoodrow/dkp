import { installController } from "@/api/controllers/installController";
import { DEVENV } from "prisma/dataMigrations/testdata/devenv";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Install");

export const installTestGuild = async ({ userId }: { userId: string }) => {
  logger.info("Started workflow.");

  await installController().start({
    activationKey: DEVENV.DEV_GUILD_ACTIVATION_KEY,
    name: DEVENV.DEV_GUILD_NAME,
    discordServerId: DEVENV.DEV_GUILD_DISCORD_SERVER_ID,
    discordOwnerRoleId: DEVENV.DEV_GUILD_DISCORD_OWNER_ROLE_ID,
    discordHelperRoleId: DEVENV.DEV_GUILD_DISCORD_HELPER_ROLE_ID,
    rulesLink: DEVENV.DEV_GUILD_RULES_LINK,
    userId,
  });

  logger.info("Finished workflow.");
};
